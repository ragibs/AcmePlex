# Movie Theater Ticket Reservation App

### ENSF 614 - Fall 2024 Term Project

**Department of Electrical and Computer Engineering**  
**Principles of Software Design**

---

## Project Overview

This project involves designing and implementing a Movie Theater Ticket Reservation application for a fictional company, **AcmePlex**. The system enables customers to search for movies, select showtimes, choose seats, and make payments for tickets. The application distinguishes between two types of users: ordinary users and registered users, offering additional benefits to registered users, such as fee exemptions and early access to ticket bookings.

This project serves as a comprehensive exercise in software design and development, applying systematic design methodologies and implementing best practices in modularity, scalability, and maintainability.

---

## Features

1. **User Registration and Login**

   - Supports two user types:
     - **Ordinary Users**: Can search movies, book tickets, and cancel reservations (with a 15% admin fee if canceled up to 72 hours before the show).
     - **Registered Users**: Enjoy benefits such as early access to 10% of the seats before public booking, no cancellation fee, and exclusive announcements. They pay a $20 annual membership fee.

2. **Movie Search and Selection**

   - Users can browse available movies, view showtimes, and choose theaters.

3. **Graphical Seat Selection**

   - A user-friendly graphical interface allows users to view and select available seats.

4. **Ticket Booking and Payment**

   - Secure ticket booking and payment process, with support for credit card transactions.
   - Receipts and tickets are sent via email upon successful booking.

5. **Cancellation and Refund Policy**

   - Tickets can be canceled up to 72 hours before the show for a credit, with a 15% fee for ordinary users. Registered users can cancel without a fee.

6. **Admin Console for News and Announcements**
   - Allows management to send exclusive news and announcements to registered users before public release.

---

## System Design

The system follows a multi-layered architecture with a strong focus on modularity and scalability. Key components include:

- **Presentation Layer**: Handles the user interface, including forms for user interaction, seat selection visuals, and confirmation dialogs.
- **Domain Layer**: Manages core business logic, such as user roles, payment processing, ticketing, and cancellation policies.
- **Data Layer**: Interacts with the MySQL database to store user information, movie details, seat availability, and booking records.

### Key Diagrams

- **Activity Diagrams**: Showcase the steps for browsing, booking, and payment processes.
- **Use Case Diagrams**: Represent user interactions with the system's core functionalities.
- **Class Diagrams**: Define the system's classes, attributes, behaviors, and relationships.
- **State Transition Diagrams**: Illustrate states for objects like `Ticket` and `Payment`.
- **Package Diagram**: Details the interactions between presentation, domain, and data layers.
- **Deployment Diagram**: Shows the system's architecture, including client, server, and database interactions.

---

## Installation and Setup

1. **Prerequisites**

   - Java Development Kit (JDK 17 or above)
   - MySQL Database
   - IDE (e.g., IntelliJ IDEA or Eclipse)

2. **Database Setup**

   - Import the SQL dump file (`group5.sql`) provided in the repository to set up the database schema.

3. **Configuration**

   - Update database configuration in the `config.properties` file (found in `src/main/resources`) with your MySQL credentials.

4. **Run the Application**
   - Compile and package the application into a `.jar` file.
   - Run the `.jar` file with `java -jar yourGroup#.jar` to start the application.

---

## Usage

- **User Registration**: Users can sign up, log in, and view available movies.
- **Browse Movies**: Search for movies by title, date, and showtime.
- **Select Seats**: Choose seats from a graphical display of theater seating.
- **Make Payment**: Pay for tickets using credit card information.
- **Receive Confirmation**: Ticket and receipt are sent to the user’s email.
- **Cancel Tickets**: Users can cancel tickets up to 72 hours before the show.

---

## Testing

## Contributors
