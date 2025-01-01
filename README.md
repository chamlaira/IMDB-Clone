# Getting Started
- Go to `frontend` for the React application.
- Go to `backend` for the ExpressJS backend.
- Go to `https://omdb-eosin.vercel.app/` for the deployed app.

## Frontend Instructions
Go to the `frontend` folder.
```
cd frontend
```
Use Node 20 and above.
```
nvm install 20
nvm use 20
```
Install the dependencies.
```
npm i
# or
yarn
# or
pnpm i
# or
bun i
```
Run the dev server.
```
npm run dev
# or
yarn dev
# or
pnpm run dev
# or
bun dev
```
Go to `localhost:5173` for the app.

## Backend Instructions
Go to the `backend` folder.
```
cd backend
```
Use Node 20 and above.
```
nvm install 20
nvm use 20
```
Install the dependencies.
```
npm i
# or
yarn
# or
pnpm i
# or
bun i
```
Run the local redis server.
```
redis-server
```
Run the dev server.
```
npm run dev
# or
yarn dev
# or
pnpm run dev
# or
bun dev
```
Go to `localhost:8080` for the API.

## Stretch Goals
1. Infinite Scrolling

    I implemented infinite scrolling using the `IntersectionObserver` API for the search results.
2. Caching

    I implemented backend caching for both the search results and the movie details page using Redis. They expire after 1 hour.
3. Animations
   - I added a reusable loading component with animation for the loading states.
   - I added animations for search results.
   - I added animations when toggling between dark and light modes.
   - I added animations to the "Get recommendations" button.
4. Mobile responsiveness

    I designed the movie details page to be as close as possible to the that of the IMDB site. All pages are mobile responsive.
5. Light and dark mode

    I made a feature to enable between light and dark modes using `useContext` and persisting it on local storage.
6. Recommendation engine

    I created a movie recommendation engine using `langchain` and a vector DB deployed on Supabase. I stored all viewed movies to the vector DB then used `langchain` and OpenAI to get the embeddings fetch the recommendations. Please note that viewed movies are reset on page refresh.

    To view recommendations for all viewed movies, go to any movie and click the "Get recommendations" button.
7. Redux state management

    The search input, search results, and viewed movies are stored using Redux. Please note that viewed movies are needed for the recommendation engine. See number 6 in this section.

8. Vercel deployment

    I deployed the app using Vercel. Go to `https://omdb-eosin.vercel.app/` to see the deployed app.

## Assumptions and Limitations
### Assumptions
- I assumed backend caching was better to implement than frontend caching. This is because the data is shared across all clients. Backend caching will reduce calls to the server.
- I used both useContext and Redux to demonstrate my knowledge on both.
- I used SASS instead of plain CSS so I can nest, use variables and mixins, etc.
- I chose to store the OMDB data in a vector DB for the recommendation engine, even though it might seem like overkill. I wanted to show I have experience in using RAG. Passing the plain JSON movies directly to the LLM would theoretically work as well.
### Limitations
- The API does not have authentication.
- The recommendation engine results are not cleaned and parsed. LLM hallucinations might happen at times.
