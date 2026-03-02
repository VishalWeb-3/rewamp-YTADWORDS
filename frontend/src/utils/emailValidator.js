export const isValidEmail = (email) => {
    if (!email) return false;

    const e = email.trim().toLowerCase();

    // Base email format
    const baseRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!baseRegex.test(e)) return false;

    const [username, domain] = e.split("@");

    // Block short usernames
    if (username.length < 4) return false;

    // Block purely numeric usernames
    if (/^\d+$/.test(username)) return false;

    // Block repeated single character usernames (aaaa, 1111)
    if (/^(.)\1+$/.test(username)) return false;

    // Optional: Block heavy number pattern like ab12345
    if (/^[a-z]{1,3}\d{3,}$/.test(username)) return false;

    // Optional: allow only popular domains
    const popularDomains = [
        "gmail.com",
        "outlook.com",
        "hotmail.com",
        "yahoo.com",
        "icloud.com",
        "live.com",
        "msn.com",
        "protonmail.com",
        "aol.com"
    ];

    if (!popularDomains.includes(domain)) return false;

    return true;
};
