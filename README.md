# Notes

In package.json `sass` script is set up to monitor the whole directory and generate separate files for each file inside `src/stylesheets`.

# Instrucions

Members can write posts on the mainboard. 
Everyone can read posts.
Only members can write posts.
Only members can see who the author of other posts is.
Members will see discounted prices inside the shop, with a crossed line over the current price, the new price, and a label saying MEMBERS DISCOUNT.

When users sign up they should not be automatically given memebrship status. Add a page where members can "join the club" by entering a secret passcode. If they enter the passcode correctly then update their membership status.

When a user is logged in, only then he can see the "create a new message" form. Outsiders cannot see this form.

Add an optional field to the user model that has `admin === true` that has the ability to delete messages. For this you need to add a way for a user to become and admin (for example you can add a checkbox on the sign up page, no need to be anything fancy).

By this point, anyone who comes to the site should be able to see a list of all messages, with the author's names hidden. Users should be able to sign-up and create messages, but ONLY users that are members should be able to see the author and date of each message. Finally, you should have an Admin user that is able to see everything and also has the ability to delete messages.

There will be no admin panel to add products because that's out of the scope of this project.

# Routes
Index: 
* get /
* get /talk-board
* get /shop
* get /sign-in
* get /sign-up
* get /membership
* get /cart
* post /sign-in
* post /sign-up
* post /log-out

Product:
* get /product/:product_id/:product_name




# Using Include and Mixins
Using only include will not allow you to use variables.
Using include and then using a mixin from the page you included will allow you to use variables that you can pass inside the mixin.

# How header works
Header has to be transparent on the main page, but it has to have a background image on the rest of the website. 
It can be included using a mixin with a variable. If you pass a "deactivaiton" variable inside the mixin, then the header background will not show. If you don't pass anything inside the mixin then the header background will be present.
OR
Since you will only need this behavior inside the homepage, you can add a style tag that will set the background image of the header to null only inside the homepage

# Notes
The controller must pass the stylesheets that the view will use.
