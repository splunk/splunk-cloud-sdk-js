const { ServiceClient } = require("../client");

const HOST = "";
const PORT = "";
const AUTH_TOKEN = "";
const TENANT_ID = "";

// Authenticate a ServiceClient
const client = new ServiceClient(`https://${HOST}:PORT`, AUTH_TOKEN, TENANT_ID);

// Add a rule via catalog to add field extractions

// Get data in using HEC

// Search the data ingested above and ensure the field extractions are present.
