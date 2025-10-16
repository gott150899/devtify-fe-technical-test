# Tran Ty Go - [Front-End Developer] Technical Test

## Tech Stack

- **React**: JavaScript library for building user interfaces.
- **Vite**: A modern build tool for React applications.
- **Ant Design**: UI library for building rich, interactive user interfaces.

## Lazy Loading / Infinite Scroll Technique

This application implements **lazy loading** combined with **infinite scroll** to load data when the user scrolls to the bottom of the table. This approach improves performance by loading data on demand and reducing unnecessary requests.

### How It Works

- **Debounce** is applied when the user scrolls to the bottom of the table. It prevents frequent API calls by delaying the request until the user stops scrolling. After the debounce time, the API is called, and new data is appended to the table.
- **Debounce** helps to avoid issues like excessive API requests. Although it introduces a slight delay in the user experience, it reduces unwanted edge cases that could occur when using **throttle**.

> Note: While **debounce** introduces a slight delay when scrolling, it is more reliable than **throttle** in preventing potential issues, especially in edge cases.

## Mockup API Configuration

To adjust the mockup API parameters, you can edit the values in the `src/utils/constant.util.ts` file. The configurable parameters are:

- `mockupUrl`: The URL of the mockup API.
- `mockupResponseTime`: The simulated response time from the API.
- `mockupDebounceTime`: The debounce time when scrolling to the bottom of the table.
- `pageSize`: The number of records per page (each API call).

## Setup Instructions

**Clone the Repository**: Clone the repo to your local machine.
   ```bash
   git clone <REPOSITORY_URL>
   cd <project-folder-name>
   npm install
   npm run dev
   http://localhost:5173
