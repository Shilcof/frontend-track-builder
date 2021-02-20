# frontend-track-builder

Frontend code for track-builder, a javascript single page web application where users can build and submit tracks to a database handled in the backend by Ruby on Rails (git repo here https://github.com/Shilcof/backend-track-builder).

When viewing tracks, a 'car' is generated for each user that can be driven around the track. Using websockets, the location of the car is braodcast to any other user that is also viewing that track so that they can race each other on it.

The app is currently hosted at https://track-builder.netlify.app/, please visit it and encourage your friends to visit the same track to race!

## Installation

NetWorkOut was developed using Javascript and Ruby on Rails.

To run NetWorkOut on your machine, you must first download the files from this repository and the backend. On the backend you must change into the main directory in your terminal.

Then you must use bundler to install the required gems.

```bash
bundle install
```

To set up the database for the application and seed it with dummy data, you must run:

```bash
rails db:migrate
```

## Usage

To run the application on your computer you can host it with:

```bash
rails s
```

and then in the front end repository open the index.html page in your browser.

To stop hosting the aplication, simply enter control + 'C' into the terminal where it is running.

From here you can create your own tracks, and if you use separate private browser windows, will be able to see cars moving in each page.

## Contributing
Pull requests are welcome. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the Contributor Covenant code of conduct.

## License
The application is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).