# How to Change Links and Passwords in Rico World App

This guide will explain how to easily change the secret links (access codes) and the admin password in your Rico World application. Since you are working from your mobile and may not have programming experience, we will focus on the simplest methods.

## Important Note Before You Start:

*   **Backup Your Files**: Always make a copy of the `main.js` file before making any changes. This way, if something goes wrong, you can always revert to the original.
*   **Exactness is Key**: JavaScript code is very sensitive to errors. Make sure you type everything exactly as shown, paying attention to commas, quotes, and brackets.
*   **Online Text Editor (Recommended for Mobile)**: If editing files directly on your phone is difficult, consider using an online text editor that allows you to open, edit, and save JavaScript files. You can search for "online JavaScript editor" or "online text editor" on your mobile browser.

## 1. Changing Secret Links (Access Codes)

All secret links are stored in the `secretLinks` object within the `js/main.js` file. Each entry in this object has a "key" (your access code) and a "value" (the Base64 encoded URL).

### Steps to Change or Add Links:

1.  **Locate `main.js`**: Open the `rico-world-app` folder and navigate to `js/main.js`.

2.  **Open `main.js` for Editing**: Use a text editor on your mobile or an online text editor to open this file.

3.  **Find `secretLinks`**: Scroll down until you find a section that looks like this:
    ```javascript
    const secretLinks = {
        "ensasafayed2!": "aHR0cHM6Ly9jZG4teGVuLnN6ZmFuZ3pob3VoZC5jb20vaW5kZXguaHRtbD9kZWJ1Zz0xJnpvbmVLZXk9c2djcV92biZodGdzZXJ2ZXI9bG9naW4teHluLXRlc3QyLmhrY3hzZC5jb20mcmFuPTAuNjM5NDcwMjc5NjA0OTczNSZvcGVuSWQ9YTEw",
        "010045!": "aHR0cHM6Ly94ZnRndC1kZXYuc3pmYW5nemhvdWhkLmNvbS9pbmRleC5odG1sP2RlYnVnPTEmem9uZUtleT1zZ2NxX2Z0Z3QmaHRnc2VydmVyPWxvZ2luLXhmdGd0LWRldi5zemZhbmd6aG91aGQuY29tJnJhbj0wLjA1NzkxMTg5MDY1NDE4NDY3Jm9wZW5JZD1hYWExJiY=",
        // ... (more links)
    };
    ```

4.  **Understand the Structure**: Each line inside the curly braces `{}` represents one access code and its corresponding link.
    *   The part before the colon (`:`) is your **Access Code** (e.g., `"ensasafayed2!"`). It must be enclosed in double quotes.
    *   The part after the colon is the **Base64 Encoded URL** (e.g., `"aHR0cHM6Ly9jZG4teGVuLnN6ZmFuZ3pob3VoZC5jb20vaW5kZXguaHRtbD9kZWJ1Zz0xJnpvbmVLZXk9c2djcV92biZodGdzZXJ2ZXI9bG9naW4teHluLXRlc3QyLmhrY3hzZC5jb20mcmFuPTAuNjM5NDcwMjc5NjA0OTczNSZvcGVuSWQ9YTEw"`). This also must be enclosed in double quotes.
    *   Each entry must end with a comma (`,`), except for the very last entry before the closing `}`.

5.  **To Change an Existing Link**: Simply change the access code or the encoded URL for any entry. For example, to change the link for `"ensasafayed2!"`:
    ```javascript
    const secretLinks = {
        "ensasafayed2!": "YOUR_NEW_BASE64_ENCODED_URL_HERE", // Changed this line
        // ... other links
    };
    ```

6.  **To Add a New Link**: Add a new line following the same format. Make sure to add a comma to the previous line if it was the last one.
    ```javascript
    const secretLinks = {
        "ensasafayed2!": "aHR0cHM6Ly9jZG4teGVuLnN6ZmFuZ3pob3VoZC5jb20vaW5kZXguaHRtbD9kZWJ1Zz0xJnpvbmVLZXk9c2djcV92biZodGdzZXJ2ZXI9bG9naW4teHluLXRlc3QyLmhrY3hzZC5jb20mcmFuPTAuNjM5NDcwMjc5NjA0OTczNSZvcGVuSWQ9YTEw",
        "YOUR_NEW_CODE_HERE": "YOUR_NEW_BASE64_ENCODED_URL_HERE", // Added this new line
    };
    ```

7.  **Encoding Your URLs (Very Important!)**: The links must be in Base64 encoded format. You cannot just put a regular URL like `https://example.com`. To encode your URL:
    *   Go to an online Base64 encoder on your mobile browser (search for "Base64 encode online").
    *   Paste your full URL (e.g., `https://yourgame.com/index.html?param=value`) into the encoder.
    *   Copy the Base64 output and paste it into your `main.js` file.

8.  **Save the `main.js` file** after making your changes.

## 2. Changing the Admin Password

The admin password is also stored in the `js/main.js` file.

### Steps to Change the Admin Password:

1.  **Locate `main.js`**: Open the `rico-world-app` folder and navigate to `js/main.js`.

2.  **Open `main.js` for Editing**: Use a text editor on your mobile or an online text editor to open this file.

3.  **Find `ADMIN_PASSWORD`**: Scroll to the top of the file (or use search) and find the line that looks like this:
    ```javascript
    const ADMIN_PASSWORD = "rico011899009";
    ```

4.  **Change the Password**: Simply change the text inside the double quotes to your new desired password. Make sure to keep the double quotes.
    ```javascript
    const ADMIN_PASSWORD = "YourNewSecurePassword"; // Changed this line
    ```

5.  **Save the `main.js` file** after making your change.

## After Making Changes:

*   **Upload the Modified Files**: If your app is hosted online, you will need to upload the modified `main.js` file (and any other files you changed) to your web hosting service to see the changes live.
*   **Clear Browser Cache**: On your mobile browser, clear the cache and cookies for your app's URL to ensure it loads the latest version of the files.

By following these steps carefully, you can manage your access codes and admin password directly from your mobile device.

