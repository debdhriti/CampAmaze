![image](https://user-images.githubusercontent.com/77495660/178193629-00414c12-bf75-46f8-a41a-b6d600ee9565.png)
![image](https://user-images.githubusercontent.com/77495660/178193642-fee69497-1b57-4b30-b95d-c3a06c7971cf.png)
CampAmaze is a website where users can create and review campgrounds. In order to review or create a campground, you must have an account.
This project was created using Node.js, Express, MongoDB, and Bootstrap. Passport.js was used to handle authentication.

Features
Users can create, edit, and remove campgrounds
Users can review campgrounds once, and edit or remove their review
User profiles include more information on the user (full name, email, phone, join date), their campgrounds, and the option to edit their profile or delete their account
Search campground by name or location
Sort campgrounds by highest rating, most reviewed, lowest price, or highest price
Run it locally
Install mongodb
Create a cloudinary account to get an API key and secret code
git clone https://github.com/himanshup/yelpcamp.git
cd yelpcamp
npm install
Create a .env file (or just export manually in the terminal) in the root of the project and add the following:

DATABASEURL='<url>'
API_KEY=''<key>
API_SECRET='<secret>'
Run mongod in another terminal and node app.js in the terminal with the project.

Then go to localhost:3000.
