# CampAmaze
- #### Homepage
![image](https://user-images.githubusercontent.com/77495660/178386627-f4fbd2cc-46ca-4324-9a62-553e88c1b1df.png)
- #### All Campgrounds
![image](https://user-images.githubusercontent.com/77495660/178193629-00414c12-bf75-46f8-a41a-b6d600ee9565.png)
- #### Redirected to Login
![image](https://user-images.githubusercontent.com/77495660/178385720-32f2d6b5-5a9e-4ef3-bc0b-95b0a9f331eb.png)
- #### Leaving a review with rating
![image](https://user-images.githubusercontent.com/77495660/178193642-fee69497-1b57-4b30-b95d-c3a06c7971cf.png)
- #### Editing a campground
![image](https://user-images.githubusercontent.com/77495660/178385945-3e618cc4-55e4-4503-a475-7f788c6cf0cc.png)
- #### Creating new campground
![image](https://user-images.githubusercontent.com/77495660/178386391-802874f1-77fe-484f-97ba-c23f49d9d021.png)


CampAmaze is a website where users can create and review campgrounds. In order to review or create a campground, you must have an account.
This project was created using **Node.js**, **Express**, **MongoDB**, and **Bootstrap**. **Passport.js** was used to handle authentication.

## **Features**
- Users can create, edit, and remove campgrounds
- The campgrounds can be viewed using a map
- Users can review campgrounds, and remove their reviews
## **Run it locally**
- Install mongodb
- Create a cloudinary account to get an API key and secret code
- ```git clone https://github.com/debdhriti/CampAmaze.git```
- cd CampAmaze
- ```npm install```
- Create a .env file (or just export manually in the terminal) in the root of the project and add the following:
```
DATABASEURL='<url>'
API_KEY=''<key>
API_SECRET='<secret>'
```
Run ```mongod``` in another terminal and ```node app.js``` in the terminal with the project.

Then go to [localhost:3000](localhost:3000/).
