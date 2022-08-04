# Notes

In package.json `sass` script is set up to monitor the whole directory and generate separate files for each file inside `src/stylesheets`.

# Instrucions

Members can write posts on the mainboard. 
Everyone can read posts.
Only members can write posts.
Only members can see who the author of other posts is.

When users sign up they should not be automatically given memebrship status. Add a page where members can "join the club" by entering a secred passcode. If they enter the passcode correctly then update their membership status.

When a user is logged in, only then he can see the "create a new message" form. Outsiders cannot see this form.

Add likes and comments to posts.

Add an optional field to the user model that has `admin === true` that has the ability to delete messages. For this you need to add a way for a user to become and admin (for example you can add a checkbox on the sign up page, no need to be anything fancy).

By this point, anyone who comes to the side should be able to see a list of all messages, likes and comments, with the author's names hidden. Users should be able to sign-up and create messages, likes and comments, but ONLY users that are members should be able to see the author, likes, comments and date of each message. Finally, you should have an Admin user that is able to see everything and also has the ability to delete messages.
