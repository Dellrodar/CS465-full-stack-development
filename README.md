# CS 465 Full Stack Development

## Travlr Getaways

Travlr Getaways is a full stack web application developed using the MEAN stack. The project includes a customer-facing travel website, an Angular single-page application for administration, a RESTful API built with Express and Node.js, and MongoDB for persistent data storage. Over the course of the project, the application evolved from primarily displaying travel information into a connected full stack system with reusable frontend components, CRUD operations, user authentication, role-based authorization, and secured administrative functionality.

## Architecture

The project uses two different approaches to frontend development. The customer-facing portion uses Express with Handlebars templates, HTML, CSS, and JavaScript. Express renders the pages on the server and supplies the browser with completed HTML. This approach works well for the public portion of the application because most of its purpose is displaying travel information to customers.

The administrative interface uses Angular as a single-page application (SPA). Instead of requesting an entirely new page for each action, Angular updates individual components and communicates with the backend through the API. This creates a more interactive experience for administrators managing trips. Angular also encouraged the application to be divided into reusable components and services. Coming from more experience with React, working with Angular gave me another perspective on component-based frontend development. Angular provides more structure and built-in conventions, while both approaches encourage separating the user interface into reusable pieces.

MongoDB was used as the backend database because the application's data maps naturally to document-style objects. A trip contains related fields such as destination, resort information, dates, descriptions, images, and pricing that can be represented together in a MongoDB document. MongoDB also integrates well with Node.js through Mongoose, allowing the application to work with JavaScript objects throughout most of the stack. Its flexible schema also made it practical to expand the application as additional functionality was introduced.

## Functionality

JSON and JavaScript serve different purposes even though their syntax can look similar. JavaScript is a programming language used to implement application logic, while JSON is a text-based format used to represent and exchange structured data. In Travlr Getaways, JSON acts as a common data format between the frontend and backend. Angular can send or receive JSON through HTTP requests, the Express API processes those requests, and Mongoose maps the data to MongoDB documents. This provides a consistent way for information to move through each layer of the application.

Several parts of the project were refactored as the application developed. One major change was moving trip information away from static data and accessing it through a RESTful API backed by MongoDB. The Angular application also separated API communication into services rather than placing HTTP logic directly inside individual UI components.

Reusable components were another important improvement. Components such as the trip card allow the same presentation and behavior to be reused for multiple trips rather than duplicating markup and application logic. This reduces repeated code, makes changes easier to maintain, and keeps the user interface consistent. Later iterations extended this separation into areas such as authentication, navigation, reservations, and administrative functionality.

## Testing

Testing the completed application required looking at more than whether the pages rendered correctly. A RESTful application depends on HTTP methods and endpoints to determine what action should occur. For example, `GET` requests retrieve trip information, `POST` requests create records, `PUT` requests update them, and `DELETE` requests remove them. The endpoint identifies the resource being acted upon, such as the collection of trips or a specific trip identified by its trip code.

I used Postman while developing the API to test these requests independently from the frontend. This made it possible to verify expected responses, request bodies, status codes, and CRUD behavior before relying on the Angular interface. Browser testing was then used to verify that the Angular SPA correctly called those endpoints and reflected changes in the interface.

Security added another layer to this testing process. The completed application authenticates users through a login endpoint and issues a JSON Web Token (JWT) after successful authentication. Protected requests must provide that token before the server allows the operation. The application also performs authorization checks so that administrative operations such as adding, editing, and deleting trips require an authenticated user with the admin role.

Testing therefore included both successful and unsuccessful requests. A valid administrator should be able to perform protected operations, while a missing or invalid token should result in an unauthorized response. A valid user without the required administrator role should also be denied access to administrator-only functionality. This reinforced that hiding controls in the frontend is not enough. Security must also be enforced by the backend API because endpoints can be called directly without using the user interface.

## Reflection

This course helped connect several areas of web development that are often learned separately. Building Travlr Getaways required working across the frontend, API, database, and authentication layers and understanding how changes in one layer affect the others. Although I already had experience with software development and component-based frontend frameworks such as React, working through the MEAN stack gave me more exposure to Angular, Express, MongoDB, Mongoose, RESTful API design, and full stack integration.

The most useful part of the project was seeing the application evolve incrementally. It began with a relatively simple customer-facing website and eventually included a separate administrative SPA, reusable components, database persistence, complete CRUD operations, authentication, authorization, and reservations. That progression reinforced the importance of separation of concerns instead of tightly coupling the frontend, backend, and data layers.

The security work was also especially valuable. Implementing password hashing, JWT authentication, protected endpoints, and role-based authorization demonstrated why security needs to be designed into the application rather than added only to the user interface. It also required testing failure cases, such as unauthorized and forbidden requests, rather than testing only successful operations.

Professionally, the course strengthened skills that apply directly to modern software development. I am more comfortable designing RESTful APIs, connecting multiple application layers, working with different frontend frameworks, structuring reusable components, using a document database, and securing application functionality. More importantly, I have a stronger understanding of the architectural decisions and trade-offs involved in building a complete web application rather than treating each technology as an isolated piece.

## Technologies

* Angular
* TypeScript
* JavaScript
* Node.js
* Express
* Handlebars
* MongoDB
* Mongoose
* JSON Web Tokens
* Passport
* HTML
* CSS
* Bootstrap
* Docker
* Postman

## Repository Structure

* `travlr/app_admin` - Angular single-page application
* `travlr/app_api` - RESTful API, controllers, models, routes, and authentication
* `travlr/app_server` - Express customer-facing application
* `travlr/data` - Application data and supporting resources
* `docker` - Container configuration
* `docker-compose.yml` - Multi-container development configuration
