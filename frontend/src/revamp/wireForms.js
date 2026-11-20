// Connects the revamp's static forms to this site's API, replacing the revamp's placeholder endpoints:
//   "Forgot password?"    -> the existing support route (there is no reset endpoint)
//   orders                -> filter pills only (the list itself is rendered by RevampOrders)
//   email-only boxes      -> the Contact page, like the original "Contact Now" button (email carried over)
//   the contact form      -> a support ticket (POST /api/tickets), with the original Contact page's
//                            button states (Submitting..., Submit disabled) and success message
import { isValidEmail } from '../utils/emailValidator';
import { readJson } from '../utils/orderItems';

const API_BASE = import.meta.env.VITE_API_URL || '';
export const FORGOT_PASSWORD_PATH = '/contact?reason=support&topic=password';
// The revamp's ticket topics, mapped to the values the old Contact page sent
const REASONS = { 'General Inquiry': 'general', 'Order Question': 'order', 'Technical Support': 'support', 'Refund Request': 'refund', Other: 'other' };
// Lower-case text inputs on Framer forms are spam traps; people never fill them
const TRAPS = ['website', 'company', 'message', 'subject', 'title', 'description', 'feedback', 'notes', 'details', 'remarks', 'comments'];

const field = (form, name) => form.querySelector(`[name="${name}"]`);
const value = (form, name) => (field(form, name)?.value || '').trim();

function statusFor(form) {
  let status = form.querySelector('.clone-form-status');
  if (!status) {
    status = document.createElement('p');
    status.className = 'clone-form-status';
    status.setAttribute('role', 'status');
    form.appendChild(status);
  }
  return status;
}

// Framer buttons repeat their label (default and hover copies); set every copy
function setLabel(button, text) {
  const copies = button.querySelectorAll('p');
  if (!button.dataset.label) button.dataset.label = (copies[0] || button).textContent;
  if (copies.length) copies.forEach((p) => { p.textContent = text; }); else button.textContent = text;
}
const resetLabel = (button) => { if (button.dataset.label) setLabel(button, button.dataset.label); };

/**
 * `ctx`: { canSubmitTicket, search, state, contact, goToContact } from the page.
 *   state: router state (an email carried over from an email box)
 *   contact: the Tina contact content (button and success texts)
 * Returns a cleanup function.
 */
export function wireForms(root, ctx) {
  const cleanups = [];
  const on = (form, handler) => {
    const submit = async (event) => {
      event.preventDefault();
      const button = form.querySelector('button[type="submit"]:not([hidden])');
      const status = statusFor(form);
      form.querySelectorAll('button[type="submit"]').forEach((b) => { b.disabled = true; });
      try {
        await handler(status);
      } catch (err) {
        console.error('Form error:', err);
        status.textContent = err.message || 'Connection error. Please try again.';
      } finally {
        form.querySelectorAll('button[type="submit"]').forEach((b) => { b.disabled = false; resetLabel(b); });
        button?.blur();
      }
    };
    form.addEventListener('submit', submit);
    cleanups.push(() => form.removeEventListener('submit', submit));
  };

  // "Forgot password?" keeps its current destination
  root.querySelectorAll('a[href="/forgot-password"], a[href="/forgot-password/"]').forEach((a) => a.setAttribute('href', FORGOT_PASSWORD_PATH));

  root.querySelectorAll('form').forEach((form) => {
    const kind = form.dataset.yawForm;
    if (kind === 'orders') {
      const stop = (e) => e.preventDefault();
      form.addEventListener('submit', stop);
      cleanups.push(() => form.removeEventListener('submit', stop));
    } else if (field(form, 'Email Address') && !field(form, 'Message')) {
      // "Contact us" / "Contact support" email boxes open the Contact page, as the original "Contact Now" button did;
      // the email is optional there, as it was never asked for before
      const box = field(form, 'Email Address');
      box.removeAttribute('required');
      cleanups.push(() => box.setAttribute('required', ''));
      const go = (e) => {
        e.preventDefault();
        ctx.goToContact?.(value(form, 'Email Address'));
      };
      form.addEventListener('submit', go);
      cleanups.push(() => form.removeEventListener('submit', go));
    } else {
      const submits = Array.from(form.querySelectorAll('button[type="submit"]'));
      const texts = ctx.contact || {};
      // Name is the revamp's extra field; the original form only required the email and message
      field(form, 'Name')?.removeAttribute('required');
      const email = field(form, 'Email');
      if (email && ctx.state?.email && !email.value) email.value = ctx.state.email;
      // Ticket switch off: the original shows a disabled "Submit disabled" button
      if (!ctx.canSubmitTicket) {
        submits.forEach((b) => { b.disabled = true; setLabel(b, 'Submit disabled'); });
        cleanups.push(() => submits.forEach((b) => { b.disabled = false; resetLabel(b); }));
      }
      // Arriving from "Forgot password?": preset the topic and message like the old Contact page
      const params = new URLSearchParams(ctx.search || '');
      const message = field(form, 'Message');
      if (message && params.get('topic') === 'password' && !message.value) message.value = 'I forgot my password and need help resetting it.';
      const reason = params.get('reason');
      if (reason) {
        const label = Object.keys(REASONS).find((k) => REASONS[k] === reason) || (reason === 'support' ? 'Technical Support' : null);
        const radio = label && form.querySelector(`input[type="radio"][name="Reason"][value="${label}"]`);
        if (radio) radio.checked = true;
      }
      on(form, async (status) => {
        if (!ctx.canSubmitTicket) { status.textContent = 'Submitting tickets is turned off right now. Please try again later.'; return; }
        if (TRAPS.some((name) => value(form, name))) { status.textContent = 'Thanks. Your message has been sent.'; return; }
        const email = value(form, 'Email');
        if (!isValidEmail(email)) { status.textContent = 'Please enter a valid email address.'; return; }
        const text = value(form, 'Message');
        if (!text) { status.textContent = 'Please write a message.'; return; }
        const extra = [value(form, 'Name') && `Name: ${value(form, 'Name')}`, value(form, 'Link') && `Link: ${value(form, 'Link')}`].filter(Boolean);
        const picked = form.querySelector('input[type="radio"][name="Reason"]:checked')?.value;
        status.textContent = '';
        submits.forEach((b) => setLabel(b, texts.submittingButton || 'Submitting...'));
        const res = await fetch(`${API_BASE}/api/tickets`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            email,
            reason: (picked && REASONS[picked]) || reason || '',
            orderNumber: value(form, 'Order Number'),
            message: extra.length ? `${text}\n\n${extra.join('\n')}` : text,
          }),
        });
        const data = await readJson(res);
        if (!res.ok) throw new Error(data.error || 'Could not send your message. Please try again.');
        form.reset();
        status.textContent = texts.successMessage || 'Success!';
        setTimeout(() => { if (status.isConnected && status.textContent === (texts.successMessage || 'Success!')) status.textContent = ''; }, 5000);
      });
    }
  });
  return () => cleanups.forEach((c) => c());
}
