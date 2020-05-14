Reqs:

Display:
- If user is logged in, header show's user's email, and logout button
- If user is not logging, header show's link to login and reg page

Behaviours:

Get/:
- If logged in, redirect to /urls
- else, redirect to /login

GET/urls:
- If logged in, return html with site header, list of URLS created
containing short URL, long URL, edit and delete button
- If not logged in, return html relevant error message

GET/urls/new:
- if logged in, return html with site header
Form that contains text input field for long url and submit button
- if not logged in, redirect to login page

GET/urls/id:
- If logged in and owns url, 

