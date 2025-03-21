# Small Business Chatbot
This is an AI powered chatbot for ABC Computer Repair, a pretend computer repair business in Seattle, WA. As such, it uses context about the business to answer questions that potential customers might have. These include:
 - Business Info (address, phone number, hours etc.)
 - Services provided by the business
 - Policies that the business maintains
 - What the weather is like where ABC Computer Repair is located (Seattle, WA)


# Installation:
You can just fork or clone this repository and use it as is.
✨ It just works. ✨

- Clone this repository
```bash
git clone git@github.com:paulsheridan/small-business-chatbot.git
```

- Enter into the new directory:
```bash
cd small-business-chatbot
```

- Add an OpenAI key to your env either by
    - adding a .env file to the `backend` directory of this project, or
    - exporting one to memory
- Use docker to start the frontend and backend
```bash
docker-compose up --build
```

- Last, navigate to `http://localhost:5173/` in your browser.


# Architectural Decisions
I chose to include a backend for a number of reasons:
- Docker compose makes it easy to ensure that both a frontend and backend are running and will exist on the same network reliably
- It prevents an API key from sitting in browser. This is a security concern and something I'd rather not do, even in a non-production app.
- It allows a lot more flexibility in data collection, metrics etc.


# Notes from the development process
### Project Setup
This phase is simply concerned with setting up a project that works. We need a skeleton to hang all of our functionality on. This stage involves docker-compose, Vite and NodeJS troubleshooting. AI assistance is very helpful in this stage because it catches all the little things I don't see, such as URL mistakes.
By the end, I've got a front end with a button that calls a backend on page load and displays a helpful little "Backend is running!", all wrapped up in docker-compose. Things like CORS are set to wildcard origin and all methods. Additionally my OpenAI key is hardcoded, as is the port. These are things I'll clean up if I have time at the end.

### Basic Functionality
Next we move on to basic front end functionality: Can we send a message and receive a reply?
After creating a Chat component and adding a few basics, we're receiving a reply. Unfortunately that reply is "Insufficient Quota" so I'm headed to ChatGPT to get that resolved.
With that complete, we're talking to our assistant. As painful as it is, I'm going to continue working on functionality and leave styling to the end.

### Business Data
Let's inject some context!
I've decided that this business will be a computer repair business. I'll be using SQLite for simplicity. In `backend/src/db.ts` you'll find a simple schema with business details such as:
- Business Info
- Services
- Policies
- FAQ's (this was ChatGPT's idea, I think it's great.)
I've also asked ChatGPT to whip up some default data. It's been added to package.json and can be run with `npm run seed` so that you're not stuck typing.

In re-reading the coding challenge, I realize that an administrative UI wherein business details can be changed is not explicitly requested. In the interest of staying as close as possible to the requested software, I'm removing it and replacing it with a Typescript file with hard-coded business data. I'll add it back if I have time because I think it'd be cool.

### Metrics
We've got streaming responses and a reliable chatbot. Where to next? Let's log the messages sent on the app and make them available in a dashboard.
This is going to mean adding a router of some kind in our frontend, as well as setting up a small database and sending it messaging data every time a message is sent or received.
I love Tanstack's router, but react-router-dom is much less opinionated, so we'll go with that. The name of the game here is speed! Ok, so we're dumping every question and response into a big list and throwing them onto the dashboard, but for now it's working, even if it's not pretty. Moving on.

### External API Calls
For the life of me, I cannot think of an external API that a repair service would need to provide its customers, so I'm doing the easy thing and taking the example from the document: The weather. I suppose it can be argued that customers might want to know if they'll have to run with their electronics through the rain in the parking lot to get to our repair center.
