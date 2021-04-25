# crud-rest-auth

A CRUD REST API with JWT-based refresh token authentication, built with
Express, MongoDB, Typescript and Docker.

A Postman collection of API requests is available as
`crud-rest-auth.postman_collection.json`, and a high level design is available
at `doc/design.png`.

## Program details

By default there are two users,

- `user` with password `user`, with role `User`
- `admin` with password `admin` with role `Admin`

unauthenticated requests can:

- Authenticate (sign in)
- Refresh a token

Users can do whatever the public can do, plus:

- Revoke their own token
- Get their own details
- Get their own refresh token
- Get todos

Admins can do whatever Users can do, plus:

- Revoke anyone's token
- Get all users' details
- Get any users' refresh token
- Create todos
- Update todos
- Delete todos

### Running with Docker

Ensure the Docker service/daemon is running (e.g. by opening Docker Desktop),
then at the root directory:

```bash
docker-compose up
```

Assuming Docker Compose is installed (it's included in a Docker Desktop
installation).

The API will be accessible at <http://localhost:2525>.

### Without Docker

- Ensure an instance of MongoDB is running locally on port 27017, and that there
  is a connection to a database called `crud-rest-auth`.
- Ensure Node (and NPM or Yarn) is installed.

At the root, after `npm install`,

```bash
npm start
```

or

```bash
yarn start
```

The application will be accessible at <http://localhost:2525>.
