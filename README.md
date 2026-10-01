# NaMahlzeit! 🍽️
*NaMahlzeit* is a web application designed to simplify meal planning for shared living spaces, families, or any group that wants to coordinate meals efficiently. Built with Django on the backend and React on the frontend, this app provides an intuitive interface for creating meal schedules, managing inventories, and more.

## 🎯 Project Idea
This project originated from a common challenge in my shared apartment: deciding what to cook for the upcoming days. *NaMahlzeit* solves this by offering a collaborative space where users can plan meals, manage ingredients, and share their meal schedules with a group, making meal planning a hassle-free experience.

## 🚀 Demo
Check out the live demo of the app [here](https://na-mahlzeit.de/login/). Feel free to log in with the provided test credentials to explore the features:
- **Username**: `TestUser`
- **Password**: `TestPassword17`

## ✨ Features
- 📅 **Meal Planner** with drag-and-drop functionality
- 🛒 **Shopping List** automatically generated based on your meal plan
- 📦 **Inventory List** to track your ingredients
- 🍽️ **Create Your Own Meals** and save them for future use
- 🔍 **Meal and Ingredient Search** for easy browsing
- 🎲 **Random Meal Shuffle** for quick decision-making
- 🏷️ **Tags** for better search results, applicable to both ingredients and meals
- 📄 **Downloadable Data Dumps** for meals, ingredients, and tags
- 🔐 **User Authentication**: Log in and create new user accounts
- 🤖 **AI Auto Tagging** *(coming soon!)*

## 🖼️ Screenshots
### Meal Library
![Meal Library](https://github.com/Robin1999Stark/NaMahlzeit/blob/main/Screenshots/Library.png?raw=true)

### Weekly Planner
![Weekly Planner](https://github.com/Robin1999Stark/NaMahlzeit/blob/main/Screenshots/Planner.png?raw=true)

### Shopping List
![Shopping List](https://github.com/Robin1999Stark/NaMahlzeit/blob/main/Screenshots/ShoppingList.png?raw=true)

## 🛠️ Tech Stack
- **Frontend**: React with TailwindCSS for styling and CSS animations
- **Backend**: Django for a robust, scalable backend
- **Database**: PostgreSQL

## Symfony backend development

The standalone PHP 8.4 / Symfony 7.4 LTS backend lives in `Backend/symfony`.
Start it with `task run-dev-symfony`, then open http://localhost:8080/health.
The response is `{"status":"ok"}`. Only Docker and Task are required locally.

The service uses the Compose profile `symfony`; it can also be started directly:

```sh
docker compose -f docker-compose.dev.yml up -d --build --wait backend-symfony
```

Compose starts the existing PostgreSQL 18 service `db` and waits until it is
healthy. Both Compose configurations use the same database image and data mount.
`/health` checks HTTP liveness; `/ready` checks database availability (`200` when
available, `503` otherwise). The container healthcheck uses `/ready`.
There is no authentication or frontend integration yet.

Doctrine ORM and DBAL connect through `DATABASE_URL`. Compose defaults to
`postgresql://robin:postgres@db:5432/postgres?serverVersion=18&charset=utf8`;
override it with `SYMFONY_DATABASE_URL` (URL-encode special characters in credentials).
`SYMFONY_APP_SECRET` sets the Symfony secret; the development configuration has
a local default. The runtime configuration uses `APP_ENV=prod` and disables debug.

The backend uses hexagonal architecture:

```text
Backend/symfony/
  src/Domain/                     # Framework-independent models and rules
  src/Application/Port/Inbound/   # Interfaces exposed by use cases
  src/Application/Port/Outbound/  # Persistence interfaces consumed by use cases
  src/Application/Service/        # Use cases
  src/Inbound/Http/               # Symfony controllers
  src/Outbound/Persistence/       # Doctrine adapters and persistence entities
  config/                         # Wiring, routes, and database configuration
```

Each class and interface has its own file and uses strict types. Dependencies
are injected through constructors. Domain classes encapsulate their state and
have no Symfony or Doctrine dependencies. `IngredientRepository` is implemented
by `DoctrineIngredientRepository`, which reads the existing Django table
`foodplaner_ingredient`. A separate Doctrine entity maps the quoted `preferedUnit`
column and nullable values to the independent domain model. Ingredient HTTP
endpoints can be added through application use cases later.

Django continues to own schema migrations (`task db-init`). Symfony startup does
not create databases, run migrations, or update the schema. The Doctrine mapping
currently covers only ingredients, not the entire Django schema.

Development source, configuration, and tests are mounted into the container;
changes are available without restarting. Re-run `task run-dev-symfony` after
changes to Composer dependencies or the Dockerfile to rebuild the image.
Run `task check-symfony` for configuration, mapping, and PHPUnit checks.
Run `task check-symfony-db` to include the PostgreSQL integration test; it uses a
temporary table in a rolled-back transaction without modifying existing records.
Stop the backend with `task stop-symfony`.

For the runtime image (without development dependencies or source mounts), use:

```sh
docker compose up -d --build --wait backend-symfony
```

## Local development database

Run `task db-init` to start the local PostgreSQL database, wait until it is ready,
and apply the Django migrations. Docker must be running. The task can be run again
to apply new migrations; existing data is preserved in `data/db`.

Use `task run-dev` to start the application, then open http://localhost (port 80).
Run `task load-test-data` (alias: `task load-data`) to initialize the database and
import the predefined sample data from
`Backend/backend/foodplaner/fixtures/test_data.json`. This includes ingredients,
meals, meal plans, inventory, and shopping lists. The backend does not need to be
running. Re-running the task reloads the fixture records using their existing IDs
and overwrites changes to those records; it does not clear the database.

## 📅 Roadmap
- [x] Implement meal planner with drag-and-drop
- [x] Generate shopping and inventory lists
- [x] Allow creation of custom meals and ingredient tagging
- [x] Provide data export options
- [ ] Implement AI-powered auto-tagging for enhanced meal suggestions

## 🤝 Contributing
Feel free to fork this repository, make your changes, and submit a pull request. All contributions are welcome to improve this project.

## 📄 License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
