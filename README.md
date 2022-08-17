# Notes

In package.json `sass` script is set up to monitor the whole directory and generate separate files for each file inside `src/stylesheets`.

# Instructions

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
Using only `include` will not allow you to use variables.
Using `include` and then using a mixin from the page you included will allow you to use variables that you can pass inside the mixin.

# How navbar works
Navbar has to be transparent on the main page, but it has to have a background image on the rest of the website. 
It can be included using a mixin with a variable. If you pass a "deactivaiton" variable inside the mixin, then the header background will not show. If you don't pass anything inside the mixin then the header background will be present.
OR
Since you will only need this behavior inside the homepage, you can add a style tag that will set the background image of the header to null only inside the homepage

# Sessions
For the user authentication I'm following [this tutorial](https://www.passportjs.org/tutorials/password/) but I will be using `mongo-connect` instead of sqlite3 so the code will be a bit different. [This other tutorial](https://meghagarwal.medium.com/storing-sessions-with-connect-mongo-in-mongodb-64d74e3bbd9c) is useful to understand how to save sessions in mongoDB.

# Handling the password
It is probably a good idea to send an already hashed password in the POST request in the user signup and login. This is because HTTPS is indeed secure, but it is not bulletproof, and it is never a good idea to send a password in plain-text.

[Source](https://stackoverflow.com/questions/3391242/should-i-hash-the-password-before-sending-it-to-the-server-side)
```


This is an old question, but I felt the need to provide my opinion on this important matter. There is so much misinformation here

The OP never mentioned sending the password in clear over HTTP - only HTTPS, yet many seem to be responding to the question of sending a password over HTTP for some reason. That said:

I believe passwords should never be retained (let alone transmitted) in plain text. That means not kept on disk, or even in memory.

People responding here seem to think HTTPS is a silver bullet, which it is not. It certainly helps greatly however, and should be used in any authenticated session.

There is really no need to know what an original password is. All that is required is a reliable way to generate (and reliably re-generate) an authentication "key" based on the original text chosen by the user. In an ideal world this text should immediately generate a "key" by salting then irreversibly hashing it using an intentionally slow hash-algorithm (like bcrypt, to prevent Brute-force). Said salt should be unique to the user credential being generated. This "key" will be what your systems use as a password. This way if your systems ever get compromised in the future, these credentials will only ever be useful against your own organisation, and nowhere else where the user has been lazy and used the same password.

So we have a key. Now we need to clean up any trace of the password on the clients device.

Next we need to get that key to your systems. You should never transmit a key or password "in the clear". Not even over HTTPS. HTTPS is not impenetrable. In fact, many organisations can become a trusted MITM - not from an attack perspective, but to perform inspections on the traffic to implement their own security policies. This weakens HTTPS, and it is not the only way it happens (such as redirects to HTTP MITM attacks for example). Never assume it is secure.

To get around this, we encrypt the key with a once off nonce.
This nonce is unique for every submission of a key to your systems - even for the same credential during the same session if you need to send it multiple times. You can reverse said nonce (decrypt), once it arrives in your own systems to recover the authentication key, and authenticate the request.

At this point I would irreversibly hash it one last time before it is permanently stored in your own systems. That way you can share the credential's salt with partner organisations for the purposes of SSO and the like, whilst being able to prove your own organisation cannot impersonate the user. The best part of this approach is you are never sharing anything generated by the user without their authorisation.

Do more research, as there is more to it than even I have divulged, but if you want to provide true security to your users, I think this method is currently the most complete response here.

TL;DR:

Use HTTPS. Securely hash passwords, irreversibly, with a unique salt per password. Do this on the client - do not transmit their actual password. Transmitting the users original password to your servers is never "OK" or "Fine". Clean up any trace of the original password. Use a nonce regardless of HTTP/HTTPS. It is much more secure on many levels. (Answer to OP).
```

Despite this, one of the comments says that trying to login with gmail sends the password in plain sight in the post request. 

# Notes
The controller must pass the stylesheets that the view will use.

# Resources used for this project
[The Oding Project](https://www.theodinproject.com/lessons/nodejs-members-only).
[Passport Documentation](https://www.passportjs.org/docs/).

Notes on what [saveUninitialized](https://github.com/expressjs/session/issues/273) from passportjs documentation is used for.
Other resources for passportjs
https://stackoverflow.com/questions/46644366/what-is-passport-initialize-nodejs-express
https://stackoverflow.com/questions/22052258/what-does-passport-session-middleware-do/28994045#28994045


[This video](https://www.youtube.com/watch?v=F-sFp_AvHc8) in particular was **really** useful to get a good understanding of the big picture of how things work.
