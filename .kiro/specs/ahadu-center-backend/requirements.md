# Requirements Document

## Introduction

AhaduCenter is a multi-domain cultural and commercial center platform based in Addis Ababa, Ethiopia. The platform hosts three distinct service domains under one roof: a Movie Center (catalog browsing and movie request system), a Book Center (library with borrowing/reservation), and an Electronics Hub (product catalog with in-store pick-up reservation). The backend is a Node.js/Express REST API backed by MongoDB, designed to serve an already-built React + Redux frontend. All routes are prefixed with `/api`. Authentication is JWT-based with Bearer tokens passed via the `Authorization` header. File uploads are required for cover images, posters, and product photos.

---

## Glossary

- **API**: The AhaduCenter Node.js/Express REST API backend.
- **Auth_Service**: The module responsible for user registration, login, and password reset flows.
- **Book**: A library item available for borrowing or reservation by registered users.
- **Book_Service**: The API module managing the book catalog and borrowing operations.
- **Borrowing**: A time-limited lending of a Book to a registered User.
- **Client**: The React + Redux frontend application at `http://localhost:5173` (dev).
- **Contact_Service**: The API module handling contact form submissions.
- **JWT**: JSON Web Token — the signed bearer token issued on login and required for protected routes.
- **Movie**: A film or TV series catalogued in the Movie Center.
- **Movie_Request**: A user-submitted request asking the admin to add a specific movie or series.
- **Movie_Service**: The API module managing the movie catalog and movie request operations.
- **Notification**: A system-generated or admin-created message delivered to a specific User.
- **Notification_Service**: The API module managing user notifications.
- **Order**: An in-store pick-up reservation for one or more electronics products.
- **Order_Service**: The API module managing electronics purchase orders.
- **Product**: An electronics item listed in the Electronics Hub catalog.
- **Product_Service**: The API module managing the electronics catalog.
- **Review**: A user-submitted rating and comment attached to a Book or Movie.
- **Review_Service**: The API module managing reviews across domains.
- **Role**: A classification of a User — either `user` or `admin`.
- **Search_Service**: The API module providing cross-domain text search across Books, Movies, and Products.
- **Upload_Service**: The module handling multipart file uploads and returning stored file URLs.
- **User**: A registered account with a Role of `user` or `admin`.
- **User_Service**: The API module managing user profiles and dashboard data.
- **Wishlist**: A user's saved collection of Books, Movies, and Products.
- **Wishlist_Service**: The API module managing wishlist items.

---

## Requirements

### Requirement 1: Server Initialization and Cross-Origin Access

**User Story:** As a frontend developer, I want the API server to start correctly and accept requests from the React dev server, so that the client and backend can communicate during development and production.

#### Acceptance Criteria

1. THE API SHALL expose all endpoints under the `/api` path prefix.
2. WHEN the API receives a request from the Client origin (`http://localhost:5173`), THE API SHALL respond with appropriate CORS headers permitting the request, including explicit allowance of methods GET, POST, PUT, PATCH, DELETE, and OPTIONS, and headers Content-Type and Authorization.
3. WHEN the API receives a CORS preflight OPTIONS request from the Client origin, THE API SHALL respond with HTTP 204 and the appropriate CORS headers before routing the request to any handler.
4. WHEN the API receives a request with an `Authorization: Bearer <token>` header, THE API SHALL parse and verify the JWT before forwarding the request to the route handler.
5. IF the JWT is expired or has an invalid signature, THEN THE Auth_Service SHALL respond with HTTP 401 and an error body indicating the token is unauthorized.
6. THE API SHALL parse `application/json` request bodies and make them available to route handlers.
7. THE API SHALL serve uploaded static files (images) from a dedicated `/uploads` directory accessible via HTTP without authentication.
8. WHEN an unhandled runtime error (5xx-class) occurs in any route handler, THE API SHALL respond with HTTP 500 and a structured JSON error body without exposing internal stack traces to the Client.

---

### Requirement 2: User Authentication

**User Story:** As a visitor, I want to register and log in to AhaduCenter, so that I can borrow books, make movie requests, and reserve electronics.

#### Acceptance Criteria

1. WHEN a `POST /api/auth/register` request is received with a unique email, a valid password (minimum 8 characters, maximum 128 characters), and a full name (maximum 100 characters), THE Auth_Service SHALL create a User record with a bcrypt-hashed password and Role of `user`, and respond with HTTP 201 and a JWT.
2. WHEN a `POST /api/auth/register` request is received with an email that already exists, THE Auth_Service SHALL respond with HTTP 409 and an error body indicating the email is already registered.
3. WHEN a `POST /api/auth/login` request is received with a valid email and correct password, THE Auth_Service SHALL respond with HTTP 200, a JWT, and the User's `id`, `name`, `email`, and `role`.
4. WHEN a `POST /api/auth/login` request is received with an unrecognised email or incorrect password, THE Auth_Service SHALL respond with HTTP 401 and an error body indicating invalid credentials.
5. WHEN a `POST /api/auth/forgot-password` request is received with a registered email, THE Auth_Service SHALL generate a cryptographically random password-reset token, store it with an expiry of 1 hour, send it to the registered email address, and respond with HTTP 200 and `{ message: "Reset instructions sent" }`.
6. IF a `POST /api/auth/forgot-password` request is received with an unregistered email, THEN THE Auth_Service SHALL respond with HTTP 200 and `{ message: "Reset instructions sent" }` without revealing whether the email is registered.
7. WHEN a `POST /api/auth/reset-password` request is received with a valid, unexpired reset token and a new password (minimum 8 characters, maximum 128 characters), THE Auth_Service SHALL update the User's hashed password, invalidate the reset token, and respond with HTTP 200.
8. IF a `POST /api/auth/reset-password` request is received with an expired or invalid token, THEN THE Auth_Service SHALL respond with HTTP 400 and an error body indicating the token is invalid or expired.
9. THE Auth_Service SHALL store passwords exclusively as bcrypt hashes and SHALL NOT store or return plaintext passwords.
10. THE JWT SHALL contain the User's `id` and `role` as payload claims, SHALL be signed with a secret stored in environment variables, and SHALL expire 24 hours after issuance.

---

### Requirement 3: User Profile and Dashboard

**User Story:** As a logged-in user, I want to view and update my profile and see my activity summary, so that I can manage my account information and track my interactions with the platform.

#### Acceptance Criteria

1. WHEN a `GET /api/users/me` request is received with a valid JWT, THE User_Service SHALL respond with the User's `id`, `name`, `email`, `phone`, `avatarUrl`, `memberSince`, and `role`.
2. WHEN a `PUT /api/users/me` request is received with a valid JWT and at least one of the updatable fields (`name`, `email`, `phone`) where `name` is non-empty and `email` is a valid email format, THE User_Service SHALL update the User record and respond with HTTP 200 and the updated User object.
3. IF a `PUT /api/users/me` request updates the email to one already used by another User, THEN THE User_Service SHALL respond with HTTP 409 and an error body indicating the email is already in use.
4. WHEN a `POST /api/users/me/avatar` multipart request is received with a valid JWT and an image file (JPEG, PNG, or WebP, maximum 5 MB), THE User_Service SHALL store the file via the Upload_Service and update the User's `avatarUrl`, responding with HTTP 200 and `{ avatarUrl: string }`.
5. WHEN a `GET /api/users/me/stats` request is received with a valid JWT, THE User_Service SHALL respond with `{ favorites: number, purchases: number, borrowed: number, movieRequests: number }` counts aggregated from all domains.
6. WHEN a `GET /api/users/me/activity` request is received with a valid JWT, THE User_Service SHALL respond with a list of the 10 most recent activity events across all domains, each containing `type`, `title`, `date`, and `status` where `status` is one of `"completed"`, `"pending"`, or `"cancelled"`.
7. IF a request to any `/api/users/me*` endpoint is received with a missing, invalid, or expired JWT, THEN THE User_Service SHALL respond with HTTP 401.
8. IF the Upload_Service fails during avatar upload, THEN THE User_Service SHALL respond with HTTP 502 and an error body indicating the upload failed.
9. IF a `PUT /api/users/me` request body contains no valid updatable fields or provides an empty `name`, THEN THE User_Service SHALL respond with HTTP 422 and a validation error body.

---

### Requirement 4: Book Catalog

**User Story:** As a visitor, I want to browse and search the Book Center catalog, so that I can discover books to borrow or reserve.

#### Acceptance Criteria

1. WHEN a `GET /api/books` request is received, THE Book_Service SHALL respond with a paginated list of Books (defaulting to page 1 with limit 20, ordered by `createdAt` descending) including `id`, `title`, `author`, `publisher`, `year`, `isbn`, `rating`, `reviewCount`, `availableCopies`, `coverUrl`, `availability`, `format`, `language`, `price`, and `category`.
2. WHEN a `GET /api/books` request is received with a `q` query parameter, THE Book_Service SHALL return only Books whose `title`, `author`, or `isbn` contains the search term (case-insensitive); if `q` is empty or absent, the full unfiltered list SHALL be returned.
3. WHEN a `GET /api/books` request is received with a `language` filter parameter, THE Book_Service SHALL return only Books matching the specified language (case-insensitive).
4. WHEN a `GET /api/books` request is received with `page` (default: 1) and `limit` (default: 20, max: 100) query parameters, THE Book_Service SHALL return the corresponding page slice and include `totalCount`, `page`, `totalPages`, and `limit` in the response envelope.
5. WHEN a `GET /api/books/:id` request is received, THE Book_Service SHALL respond with the full Book document including `description`, `pages`, `publicationDate`, `dimensions`, `about`, `authorInfo`, `borrowingPolicy`, `location`, and a list of up to 10 related Books sharing the same category.
6. IF a `GET /api/books/:id` request references a non-existent Book id, THEN THE Book_Service SHALL respond with HTTP 404 and an error body indicating the book was not found.
7. IF a `GET /api/books` request is received with a `page` or `limit` value that is non-integer, zero, or negative, THEN THE Book_Service SHALL respond with HTTP 400 and a validation error body.

---

### Requirement 5: Book Borrowing and Reservation

**User Story:** As a logged-in user, I want to borrow or reserve books, track my borrowing history, and renew or return books, so that I can manage my library activity.

#### Acceptance Criteria

1. WHEN a `POST /api/books/:id/borrow` request is received with a valid JWT and the Book has `availableCopies > 0`, THE Book_Service SHALL create a Borrowing record with `status: "Active"`, a `borrowDate` of today, a `dueDate` 14 days from today, and `renewalsLeft: 2`, decrement `availableCopies` by 1, and respond with HTTP 201 and the Borrowing record.
2. IF a `POST /api/books/:id/borrow` request is received and the Book has `availableCopies === 0`, THEN THE Book_Service SHALL respond with HTTP 409 and an error body indicating no copies are available.
3. WHEN a `POST /api/books/:id/reserve` request is received with a valid JWT, THE Book_Service SHALL create a reservation record with `bookId`, `userId`, `status: "Reserved"`, and `reservationDate` of today, and respond with HTTP 201 and the reservation record.
4. WHEN a `GET /api/users/me/borrowings` request is received with a valid JWT, THE Book_Service SHALL respond with all Borrowing records for the User, including `bookId`, `title`, `author`, `coverUrl`, `borrowDate`, `dueDate`, `returnDate`, `status`, `renewalsLeft`, and `fee`.
5. WHEN a `POST /api/borrowings/:id/renew` request is received with a valid JWT and the Borrowing has `status: "Active"` and `renewalsLeft > 0`, THE Book_Service SHALL extend `dueDate` by 14 days, decrement `renewalsLeft` by 1, and respond with HTTP 200 and the updated Borrowing record.
6. IF a `POST /api/borrowings/:id/renew` request is received and `renewalsLeft === 0`, THEN THE Book_Service SHALL respond with HTTP 400 and an error body indicating no renewals remain.
7. WHEN a `POST /api/borrowings/:id/return` request is received with a valid JWT and the Borrowing has `status: "Active"` or `"Overdue"`, THE Book_Service SHALL set `status: "Returned"`, set `returnDate` to today, increment the Book's `availableCopies` by 1, and respond with HTTP 200.
8. WHEN a Borrowing is fetched and its `dueDate` is in the past and its `status` is `"Active"`, THE Book_Service SHALL set `status: "Overdue"` and include a calculated `fee` equal to the number of calendar days overdue multiplied by the daily rate configured in the `OVERDUE_FEE_PER_DAY` environment variable (default: 1).
9. IF a request to any borrowing endpoint is received with a missing, invalid, or expired JWT, THEN THE Book_Service SHALL respond with HTTP 401.
10. IF a `POST /api/books/:id/borrow` request is received and the User already has an active Borrowing for the same Book, THEN THE Book_Service SHALL respond with HTTP 409 and an error body indicating the book is already borrowed.

---

### Requirement 6: Movie Catalog

**User Story:** As a visitor, I want to browse the Movie Center catalog and view detailed movie information, so that I can discover films available at AhaduCenter.

#### Acceptance Criteria

1. WHEN a `GET /api/movies` request is received, THE Movie_Service SHALL respond with a paginated list of Movies (defaulting to page 1, limit 20, ordered by `createdAt` descending) including `id`, `title`, `posterUrl`, `year`, `country`, `runtime`, `quality`, `language`, `genres`, `rating`, and `releaseDate`.
2. WHEN a `GET /api/movies` request is received with a `q` query parameter, THE Movie_Service SHALL return only Movies whose `title`, `director`, or `genres` contains the search term (case-insensitive).
3. WHEN a `GET /api/movies` request is received with a `genre` filter parameter, THE Movie_Service SHALL return only Movies containing the specified genre in their `genres` array (case-insensitive match).
4. WHEN a `GET /api/movies` request is received with `page` (default: 1, minimum: 1) and `limit` (default: 20, max: 100) query parameters, THE Movie_Service SHALL return the corresponding page slice with pagination metadata (`totalCount`, `page`, `totalPages`, `limit`).
5. WHEN a `GET /api/movies/:id` request is received, THE Movie_Service SHALL respond with the full Movie document including `bannerUrl`, `subtitles`, `director`, `writers`, `studio`, `trailerUrl`, `description`, `cast` (array of `{ name, role, photoUrl }`), `screenshots` (array of URLs), `trailerThumbnail`, and a list of up to 10 related Movies sharing at least one genre.
6. IF a `GET /api/movies/:id` request references a non-existent Movie id, THEN THE Movie_Service SHALL respond with HTTP 404 and an error body indicating the movie was not found.

---

### Requirement 7: Movie Requests

**User Story:** As a logged-in user, I want to submit a request for a movie or series, view my past requests, and cancel pending ones, so that I can communicate my content preferences to the AhaduCenter team.

#### Acceptance Criteria

1. WHEN a `POST /api/movie-requests` request is received with a valid JWT and a non-empty `title` field (maximum 200 characters), THE Movie_Service SHALL create a Movie_Request record with `status: "Pending"`, optional fields `type`, `year`, `genre`, and `details` if provided, assign it a unique request ID, and respond with HTTP 201 and the Movie_Request record.
2. WHEN a `GET /api/users/me/movie-requests` request is received with a valid JWT, THE Movie_Service SHALL respond with all Movie_Request records for the User (or an empty array if none exist), including `id`, `title`, `type`, `year`, `genre`, `details`, `requestedAt` (submission timestamp), and `status`.
3. WHEN a `DELETE /api/movie-requests/:id` request is received with a valid JWT and the Movie_Request has `status: "Pending"` and belongs to the requesting User, THE Movie_Service SHALL delete the record and respond with HTTP 200.
4. IF a `DELETE /api/movie-requests/:id` request is received and the Movie_Request does not belong to the requesting User, THEN THE Movie_Service SHALL respond with HTTP 403.
5. IF a `DELETE /api/movie-requests/:id` request is received and the Movie_Request does not have `status: "Pending"`, THEN THE Movie_Service SHALL respond with HTTP 400 and an error body indicating only pending requests can be cancelled.
6. IF a `DELETE /api/movie-requests/:id` request references a non-existent Movie_Request id, THEN THE Movie_Service SHALL respond with HTTP 404.
7. IF a `POST /api/movie-requests` request is received with an absent or empty `title` field, THEN THE Movie_Service SHALL respond with HTTP 400 and a validation error body.

---

### Requirement 8: Electronics (Product) Catalog

**User Story:** As a visitor, I want to browse the Electronics Hub catalog and view detailed product information, so that I can discover and compare electronics available at AhaduCenter.

#### Acceptance Criteria

1. WHEN a `GET /api/products` request is received, THE Product_Service SHALL respond with a paginated list of Products (defaulting to page 1, limit 20, ordered by `createdAt` descending) including `id`, `name`, `brand`, `condition`, `images` (first image URL), `rating`, `reviewCount`, `price`, `originalPrice`, `discount` (integer percentage 0–100), and `category`.
2. WHEN a `GET /api/products` request is received with a `q` query parameter, THE Product_Service SHALL return only Products whose `name`, `brand`, or `category` contains the search term (case-insensitive).
3. WHEN a `GET /api/products` request is received with a `category` filter parameter, THE Product_Service SHALL return only Products matching that category (case-insensitive).
4. WHEN a `GET /api/products` request is received with `minPrice` and/or `maxPrice` query parameters, THE Product_Service SHALL return only Products whose `price` falls within the specified range (inclusive); if only one bound is provided, the other SHALL be treated as unbounded.
5. WHEN a `GET /api/products` request is received with `page` (default: 1) and `limit` (default: 20, max: 100) query parameters, THE Product_Service SHALL return the corresponding page slice with pagination metadata (`data`, `totalCount`, `page`, `totalPages`, `limit`).
6. WHEN a `GET /api/products/:id` request is received, THE Product_Service SHALL respond with the full Product document including all `images`, `description`, `highlights` (array of strings), `specifications` (key-value map), and a list of up to 10 similar Products in the same category.
7. IF a `GET /api/products/:id` request references a non-existent Product id, THEN THE Product_Service SHALL respond with HTTP 404 and an error body indicating the product was not found.

---

### Requirement 9: Purchase Orders (Electronics In-Store Pick-Up)

**User Story:** As a logged-in user, I want to place an in-store pick-up reservation for electronics, track my orders, and view past purchase history, so that I can plan my visit to the physical store.

#### Acceptance Criteria

1. WHEN a `POST /api/orders` request is received with a valid JWT and a non-empty `items` array of `{ productId, quantity }` objects where each `quantity` is an integer between 1 and 99, THE Order_Service SHALL create an Order record with `status: "Processing"`, compute `subtotal` as the sum of each product's `price` multiplied by its `quantity`, compute `totalPayableAtStore` as `subtotal` plus a fixed `reservationFee`, assign a unique order ID, and respond with HTTP 201 with the full Order document.
2. IF a `POST /api/orders` request is received with an empty `items` array, a `quantity` outside 1–99, or any `productId` that does not exist, THEN THE Order_Service SHALL respond with HTTP 400 or HTTP 404 respectively with an appropriate error body.
3. WHEN a `GET /api/users/me/orders` request is received with a valid JWT, THE Order_Service SHALL respond with all Orders for the User ordered by date descending, including `id`, `date`, `status`, `items` (with product name and image), `itemCount`, and `total`.
4. WHEN a `GET /api/orders/:id` request is received with a valid JWT and the Order belongs to the requesting User or the User is an admin, THE Order_Service SHALL respond with the full Order document including `customerName`, `phone`, `storeLocation`, `operatingHours`, `items`, `subtotal`, `reservationFee`, and `totalPayableAtStore`. The `storeLocation` SHALL be "Ahadu Center Hub, Bole Road (Next to Friendship HyperMarket), Addis Ababa, Ethiopia".
5. IF a `GET /api/orders/:id` request references an Order that does not belong to the requesting User and the User is not an admin, THEN THE Order_Service SHALL respond with HTTP 403.
6. IF a `GET /api/orders/:id` request references a non-existent Order id, THEN THE Order_Service SHALL respond with HTTP 404 and an error body indicating the order was not found.

---

### Requirement 10: Reviews

**User Story:** As a logged-in user, I want to post and view reviews for books and movies, so that I can share my feedback and read others' opinions.

#### Acceptance Criteria

1. WHEN a `GET /api/books/:id/reviews` request is received, THE Review_Service SHALL respond with a paginated list of reviews for the specified Book, each containing `id`, `userId`, `userName`, `rating`, `comment`, and `createdAt`.
2. WHEN a `GET /api/movies/:id/reviews` request is received, THE Review_Service SHALL respond with a paginated list of reviews for the specified Movie, each containing `id`, `userId`, `userName`, `rating`, `comment`, and `createdAt`.
3. WHEN a `POST /api/books/:id/reviews` request is received with a valid JWT, a `rating` (integer 1–5), and a `comment` (1–2000 characters), THE Review_Service SHALL create a Review record linked to the Book and the authenticated User, update the Book's aggregate `rating` and `reviewCount`, and respond with HTTP 201 and the Review.
4. WHEN a `POST /api/movies/:id/reviews` request is received with a valid JWT, a `rating` (integer 1–5), and a `comment` (1–2000 characters), THE Review_Service SHALL create a Review record linked to the Movie and the authenticated User, update the Movie's aggregate `rating` and `reviewCount`, and respond with HTTP 201 and the Review.
5. IF a `POST /api/books/:id/reviews` or `POST /api/movies/:id/reviews` request is received with a `rating` outside the range 1–5, THEN THE Review_Service SHALL respond with HTTP 422 and an error body indicating the rating must be an integer between 1 and 5.
6. IF an authenticated User submits a second review for the same Book or Movie, THEN THE Review_Service SHALL respond with HTTP 409 and an error body indicating the user has already reviewed this item.
7. THE Review_Service SHALL re-compute and persist the parent item's aggregate `rating` as the arithmetic mean of all review ratings after each new review is created.
8. WHEN a `GET /api/books/:id/reviews` or `GET /api/movies/:id/reviews` request is received with `page` and `pageSize` query parameters (default: page 1, pageSize 20, max pageSize 100), THE Review_Service SHALL return the corresponding page slice with pagination metadata.
9. IF a `POST /api/books/:id/reviews` or `POST /api/movies/:id/reviews` request is received without a valid JWT, THEN THE Review_Service SHALL respond with HTTP 401.
10. IF a `POST /api/books/:id/reviews` or `POST /api/movies/:id/reviews` request references a non-existent Book or Movie id, THEN THE Review_Service SHALL respond with HTTP 404.

---

### Requirement 11: Wishlist

**User Story:** As a logged-in user, I want to add and remove items from my wishlist across all domains, so that I can save movies, books, and products I'm interested in.

#### Acceptance Criteria

1. WHEN a `GET /api/users/me/wishlist` request is received with a valid JWT, THE Wishlist_Service SHALL respond with all wishlist items for the User, each containing `id`, `type` (`Movie` | `Book` | `Product`), item title, image URL, rating, category, price (if applicable), availability status, and a deep link to the item's detail page.
2. WHEN a `POST /api/users/me/wishlist` request is received with a valid JWT and `{ itemId, itemType }`, THE Wishlist_Service SHALL add the item to the User's wishlist and respond with HTTP 201 and the new wishlist entry including an `addedAt` timestamp.
3. IF a `POST /api/users/me/wishlist` request is received with an `itemId` that is already in the User's wishlist, THEN THE Wishlist_Service SHALL respond with HTTP 409 and an error body indicating the item is already in the wishlist.
4. WHEN a `DELETE /api/users/me/wishlist/:itemId` request is received with a valid JWT, THE Wishlist_Service SHALL remove the item from the User's wishlist and respond with HTTP 200.
5. IF a `DELETE /api/users/me/wishlist/:itemId` request references an item not in the User's wishlist, THEN THE Wishlist_Service SHALL respond with HTTP 404 and an error body indicating the wishlist item was not found.
6. IF a request to any wishlist endpoint is received with a missing, invalid, or expired JWT, THEN THE Wishlist_Service SHALL respond with HTTP 401.
7. IF a `POST /api/users/me/wishlist` request is received with a missing or invalid `itemId` or an unrecognised `itemType`, THEN THE Wishlist_Service SHALL respond with HTTP 400 and a validation error body.

---

### Requirement 12: Notifications

**User Story:** As a logged-in user, I want to receive and manage notifications about orders, borrowings, and platform updates, so that I stay informed about my activity.

#### Acceptance Criteria

1. WHEN a `GET /api/users/me/notifications` request is received with a valid JWT, THE Notification_Service SHALL respond with the User's notifications ordered by most recent first, each containing `id`, `type`, `title`, `description`, `timestamp`, and `isRead`; if the User has no notifications, an empty array SHALL be returned.
2. WHEN a `GET /api/users/me/notifications` request is received with a `type` query parameter, THE Notification_Service SHALL return only notifications matching the specified type; if the `type` value is unrecognised, THE Notification_Service SHALL respond with HTTP 400 and a validation error body.
3. WHEN a `PATCH /api/notifications/:id/read` request is received with a valid JWT and the notification belongs to the requesting User, THE Notification_Service SHALL mark the specified notification as `isRead: true` and respond with HTTP 200.
4. IF a `PATCH /api/notifications/:id/read` request references a non-existent notification id or a notification belonging to a different User, THEN THE Notification_Service SHALL respond with HTTP 404.
5. WHEN a `POST /api/users/me/notifications/read-all` request is received with a valid JWT, THE Notification_Service SHALL mark all of the User's notifications as `isRead: true` and respond with HTTP 200, even if the User has no unread notifications.
6. WHEN a `DELETE /api/users/me/notifications` request is received with a valid JWT, THE Notification_Service SHALL delete all notifications for the User and respond with HTTP 200, even if the User has no notifications.
7. WHEN an Order is created, THE Notification_Service SHALL automatically create a notification for the ordering User with `type: "Electronics"` indicating the order was placed.
8. WHEN a Borrowing record is created, THE Notification_Service SHALL automatically create a notification for the borrowing User with `type: "Books"` indicating the borrowing was initiated.
9. WHEN a Movie_Request status changes, THE Notification_Service SHALL automatically create a notification for the requesting User with `type: "Movies"` indicating the new status; if Notification_Service creation fails, the upstream operation (Order, Borrowing, or status update) SHALL NOT be rolled back.

---

### Requirement 13: Cross-Domain Search

**User Story:** As a visitor, I want to search across all three domains simultaneously, so that I can find books, movies, and electronics from a single search query.

#### Acceptance Criteria

1. WHEN a `GET /api/search` request is received with a non-empty `q` query parameter (1–200 characters), THE Search_Service SHALL query the Book, Movie, and Product collections in parallel and return a paginated unified results response conforming to the Requirement 19 pagination envelope.
2. WHEN a `GET /api/search` request is received, each result item in the response SHALL include `id`, `type` (`Movie` | `Book` | `Product`), `title`, `description`, `imageUrl`, `rating`, `category`, `price` (null for Movie and Book items), and `link`.
3. WHEN a `GET /api/search` request is received with a `type` query parameter of `movie`, `book`, or `product`, THE Search_Service SHALL return results from only the specified domain.
4. IF a `GET /api/search` request is received with a `type` query parameter value that is not `movie`, `book`, or `product`, THEN THE Search_Service SHALL respond with HTTP 400 and an error body listing the accepted values.
5. WHEN a `GET /api/search` request is received with `minPrice` and/or `maxPrice` query parameters (numeric values in range 0.00–999,999,999.99), THE Search_Service SHALL apply the price filter to Product results only; if only one bound is provided, the other SHALL be treated as unbounded.
6. WHEN a `GET /api/search` request is received with a `sort` parameter of `newest`, THE Search_Service SHALL order all results globally by `createdAt` descending across all domains.
7. IF a `GET /api/search` request is received without a `q` parameter or with an empty `q`, THEN THE Search_Service SHALL respond with HTTP 400 and an error body indicating a search query is required.

---

### Requirement 14: File Uploads

**User Story:** As an admin, I want to upload cover images, posters, and product photos, so that the catalog displays accurate visual content.

#### Acceptance Criteria

1. WHEN a `POST /api/uploads` multipart/form-data request is received with a valid admin JWT and an image file, THE Upload_Service SHALL store the file, generate a publicly accessible URL (resolvable without authentication), and respond with HTTP 201 and `{ url: string }`.
2. THE Upload_Service SHALL accept only files with MIME types `image/jpeg`, `image/png`, and `image/webp`.
3. IF an uploaded file exceeds 5 MB, THEN THE Upload_Service SHALL respond with HTTP 413 and an error body indicating the file size limit.
4. IF an uploaded file has an unsupported MIME type, THEN THE Upload_Service SHALL respond with HTTP 415 and an error body indicating the supported types.
5. THE Upload_Service SHALL generate unique filenames such that no two successful upload operations ever produce the same stored filename.
6. IF a `POST /api/uploads` request is received with a missing, invalid, or expired JWT or from a non-admin User, THEN THE Upload_Service SHALL respond with HTTP 401 or HTTP 403 respectively.
7. IF a `POST /api/uploads` request is received with no file field or an empty file, THEN THE Upload_Service SHALL respond with HTTP 400 and an error body indicating a file is required.

---

### Requirement 15: Admin — Content Management

**User Story:** As an admin, I want to create, read, update, and delete books, movies, and electronics, so that I can keep the catalog accurate and up to date.

#### Acceptance Criteria

1. THE API SHALL protect all admin CRUD endpoints by verifying that the authenticated User has `role: "admin"`.
2. IF a request to an admin endpoint is received from a User with `role: "user"`, THEN THE API SHALL respond with HTTP 403 and an error body indicating access is forbidden.
3. IF a request to an admin endpoint is received with a missing, invalid, or expired JWT, THEN THE API SHALL respond with HTTP 401.
4. WHEN a `POST /api/admin/books` request is received with a valid admin JWT and a complete Book payload, THE Book_Service SHALL create and persist the Book document and respond with HTTP 201 and the created Book document.
5. WHEN a `PUT /api/admin/books/:id` request is received with a valid admin JWT and updated fields, THE Book_Service SHALL update the Book document and respond with HTTP 200 and the updated Book document; IF the book id does not exist, THE Book_Service SHALL respond with HTTP 404.
6. WHEN a `DELETE /api/admin/books/:id` request is received with a valid admin JWT, THE Book_Service SHALL delete the Book document and respond with HTTP 200; IF the book id does not exist, THE Book_Service SHALL respond with HTTP 404.
7. WHEN a `POST /api/admin/movies` request is received with a valid admin JWT and a complete Movie payload, THE Movie_Service SHALL create and persist the Movie document and respond with HTTP 201 and the created Movie document.
8. WHEN a `PUT /api/admin/movies/:id` request is received with a valid admin JWT and updated fields, THE Movie_Service SHALL update the Movie document and respond with HTTP 200 and the updated Movie document; IF the movie id does not exist, THE Movie_Service SHALL respond with HTTP 404.
9. WHEN a `DELETE /api/admin/movies/:id` request is received with a valid admin JWT, THE Movie_Service SHALL delete the Movie document and respond with HTTP 200; IF the movie id does not exist, THE Movie_Service SHALL respond with HTTP 404.
10. WHEN a `POST /api/admin/products` request is received with a valid admin JWT and a complete Product payload, THE Product_Service SHALL create and persist the Product document and respond with HTTP 201 and the created Product document.
11. WHEN a `PUT /api/admin/products/:id` request is received with a valid admin JWT and updated fields, THE Product_Service SHALL update the Product document and respond with HTTP 200 and the updated Product document; IF the product id does not exist, THE Product_Service SHALL respond with HTTP 404.
12. WHEN a `DELETE /api/admin/products/:id` request is received with a valid admin JWT, THE Product_Service SHALL delete the Product document and respond with HTTP 200; IF the product id does not exist, THE Product_Service SHALL respond with HTTP 404.
13. WHEN a `GET /api/admin/movie-requests` request is received with a valid admin JWT, THE Movie_Service SHALL respond with all Movie_Request records from all users including each requesting User's identifier and display name.
14. WHEN a `PATCH /api/admin/movie-requests/:id/status` request is received with a valid admin JWT and a `status` field of `"Pending"`, `"Available"`, or `"Fulfilled"`, THE Movie_Service SHALL update the Movie_Request status and deliver a Notification to the requesting User indicating the new status; IF the request id does not exist, THE Movie_Service SHALL respond with HTTP 404.

---

### Requirement 16: Admin — Dashboard Statistics

**User Story:** As an admin, I want to view aggregate inventory counts and recent additions, so that I can get a quick overview of the platform's content state.

#### Acceptance Criteria

1. WHEN a `GET /api/admin/stats` request is received with a valid admin JWT, THE API SHALL respond with HTTP 200 and `{ totalMovies: number, totalBooks: number, totalProducts: number, totalUsers: number, totalOrders: number, totalBorrowings: number }` reflecting current collection counts.
2. WHEN a `GET /api/admin/recent` request is received with a valid admin JWT, THE API SHALL respond with HTTP 200 and three named arrays `{ recentMovies, recentBooks, recentProducts }`, each containing up to 5 items ordered by `createdAt` descending with fields `id`, `title` (or `name` for Products), and `createdAt`; if a domain has fewer than 5 items, all available items SHALL be returned.

---

### Requirement 17: Contact Form

**User Story:** As a visitor, I want to send a message to the AhaduCenter team via a contact form, so that I can ask questions or report issues.

#### Acceptance Criteria

1. WHEN a `POST /api/contact` request is received with non-empty `name`, `email` (valid email format), `subject`, and `message` fields, THE Contact_Service SHALL persist the submission and respond with HTTP 201 and `{ message: "Message received. We will get back to you shortly." }`.
2. IF a `POST /api/contact` request is received missing any of the required fields or with an invalid email format, THEN THE Contact_Service SHALL respond with HTTP 422 and a validation error body identifying the missing or invalid fields.
3. WHEN a `GET /api/admin/contacts` request is received with a valid admin JWT, THE Contact_Service SHALL respond with a paginated list of all contact submissions ordered by most recent first.

---

### Requirement 18: Input Validation

**User Story:** As a developer, I want all API inputs to be validated consistently, so that malformed or malicious data cannot corrupt the database or cause unexpected server behaviour.

#### Acceptance Criteria

1. THE API SHALL validate all request body payloads for required fields and correct data types before processing.
2. IF a request body fails validation, THEN THE API SHALL respond with HTTP 422 and a structured error body listing every validation violation with the affected field name and a descriptive message.
3. IF a `POST /api/auth/register` or `POST /api/auth/reset-password` request is received with a password shorter than 8 characters or longer than 128 characters, THEN THE Auth_Service SHALL respond with HTTP 422 and a validation error body.
4. IF a review POST request is received with a `rating` that is not an integer between 1 and 5, THEN THE Review_Service SHALL respond with HTTP 422 and a validation error body.
5. THE API SHALL trim leading and trailing whitespace from all string inputs before validation and before persisting to the database; if trimming results in an empty string for a required field, the field SHALL be treated as missing.
6. IF a path parameter that is expected to be a MongoDB ObjectId is malformed, THEN THE API SHALL respond with HTTP 400 and an error body indicating the ID format is invalid.

---

### Requirement 19: Pagination Standard

**User Story:** As a frontend developer, I want all list endpoints to use a consistent pagination contract, so that the Redux state management layer can reliably display paginated results.

#### Acceptance Criteria

1. THE API SHALL support `page` (integer ≥ 1, default: 1) and `limit` (integer 1–100, default: 20) query parameters on all endpoints that return a collection of resources.
2. WHEN a paginated endpoint is called, THE API SHALL return a response envelope of `{ data: [], totalCount: number, page: number, totalPages: number, limit: number }` where `totalPages` equals `ceil(totalCount / limit)`, or 0 when `totalCount` is 0.
3. IF a `page` or `limit` query parameter is non-integer, zero, negative, or `limit` exceeds 100, THEN THE API SHALL respond with HTTP 400 and a validation error body.
4. IF a `page` value exceeds `totalPages` and `totalPages > 0`, THEN THE API SHALL respond with HTTP 404 and an error body indicating the page was not found.
5. THE API SHALL apply pagination after all filtering and search terms so that `totalCount` reflects the filtered result set, not the entire collection.
