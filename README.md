# Crypto-Trading
# Local Machine Setup Instructions

## Backend Setup
1. Open the `Backend` folder in IntelliJ IDEA.
2. Navigate to the `application.properties` file.
3. Update the following configurations:
   - **Database Credentials:** Set your MySQL username and password, and create a database named `treading`.
   - **Java Mail Sender:**
     - Provide your email.
     - Set your Gmail app password (search online if needed: "how to create an app password for Gmail").
   - **Payment Gateway Keys:**
     - **Stripe:** Provide your API key.
     - **Razorpay:** Provide your API key and API secret.
   - **Third-Party API Keys:**
     - **Coingecko:** Provide your API key.
     - **Gemini:** Provide your API key.
4. Save the file and run the project.

## Frontend Setup
1. Open the `Frontend` folder in Visual Studio Code (VS Code).
2. Install dependencies by running:
   ```sh
   npm install
   ```
3. Start the frontend application:
   ```sh
   npm run dev
   ```
   or
   ```sh
   npm start
   ```

## Running the Application
Once both backend and frontend are running successfully, you can register and perform other operations within the application.

---
For any issues, refer to documentation or seek help online.

