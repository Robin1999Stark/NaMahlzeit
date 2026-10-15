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
- **Sessions**: Redis

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

The fixture includes 30 complete recipes for four servings each, with ingredient
quantities, preparation steps, cooking times, and filterable tags. There are
12 vegan recipes, 12 vegetarian recipes, four meat dishes, and two fish dishes,
including lentil curry, lasagne, shakshuka, salmon with broccoli, and apple porridge.
Legumes, corn, and canned tuna use drained weights; vegetable broth quantities
refer to prepared broth. The four original recipe IDs are preserved and their
placeholder content is replaced with complete recipes.

## Session storage

Django sessions use the built-in Redis cache backend with a dedicated `sessions`
cache. Both Docker Compose configurations start Redis and wait for its healthcheck
before starting the backend. Run `task run-dev` to rebuild the backend with the
Redis client dependency and start the services.

`REDIS_URL` configures the connection (default: `redis://redis:6379/0`). Redis is
accessible only within the Docker network. To use an external Redis server, set
`REDIS_URL` on the backend service; authenticated `redis://` and TLS `rediss://`
URLs are supported.

The frontend restores the signed-in user through `GET /api/users/me` on startup.
Authentication uses Django's HttpOnly `sessionid` cookie; no API token needs to be
stored in JavaScript cookies or local storage. Login requests include a CSRF token.

Session expiry follows Django's default of two weeks. Redis stores data in the
`redis-data` volume with append-only persistence, so ordinary container restarts
preserve sessions. Removing that volume or clearing Redis logs out session users.
The first deployment requires existing session users to log in again because
database sessions are not migrated. Existing API token authentication is unchanged.

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

## Frontend checks

The frontend uses Node.js 24 (see `Frontend/frontend/.nvmrc`). From
`Frontend/frontend`, run `npm ci`, `npm run lint`, `npm run build`, and `npm audit`.
The Frontend GitHub Actions workflow runs the same checks; it replaces the old
Deno workflow because this project uses npm, Vite, and ESLint.

The patched toolchain uses Vite 8, ESLint 9, React Router 7, and Tailwind CSS 4.
Tailwind styles and configuration have been migrated to its CSS-based format.
Tailwind 4 requires Safari 16.4+, Chrome 111+, or Firefox 128+; see the
[Tailwind upgrade guide](https://tailwindcss.com/docs/upgrade-guide).

## Git hooks

Run `task hooks:install` once after cloning to enable the versioned Git hooks.
Before every push, `.githooks/pre-push` runs `task check` and aborts the push if
any check fails. Checks run from the repository root, including when Git is
invoked from a subdirectory.

The checks install the locked frontend dependencies with `npm ci`, run ESLint
and the production build, then run all Django tests in Docker. Node.js 24, npm,
Go Task, and a running Docker daemon are required. If nvm is installed in its
standard location or `NVM_DIR`, the frontend check automatically selects the
version from `.nvmrc`; run `nvm install` there once if it is not installed yet.

Backend tests start PostgreSQL and Redis, rebuild the backend image, and run
against the current source. Django creates a separate `test_postgres` database;
Redis database 15 is reserved for tests to keep test sessions separate from the
application's sessions in database 0. The application containers do not need to
be running. You can also run `task frontend:check` or `task backend:test` directly.

The hook runs on `pre-push`, so commits remain quick. Git hook activation is local
to each clone; the GitHub Actions frontend checks continue to run independently.
