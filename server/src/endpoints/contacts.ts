/** biome-ignore-all assist/source/organizeImports: <idc> */
import express from 'express';
import { db } from '../db/index.js';
// ...existing code...
import { tokenizer } from '../services/tokenizer.js';

const router = express.Router();

// Get all contacts for the logged-in user
router.get('/api/contacts', async (req, res) => {
  try {
    const userId = await tokenizer(req.cookies.jwt);

    const contacts = await db
      .selectFrom('contact')
      .selectAll()
      .where('owner', '=', userId)
      .orderBy('name', 'asc')
      .execute();

    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a new contact
router.post('/api/contacts', async (req, res) => {
  try {
    const userId = await tokenizer(req.cookies.jwt);
    const { name, countryCode, calleeID } = req.body;

    if (!name || !countryCode || !calleeID) {
      return res
        .status(400)
        .json({ error: 'Name, countryCode and calleeID are required' });
    }

    const countryCodeNum = Number(countryCode);
    const calleeIDNum = Number(calleeID);

    if (Number.isNaN(countryCodeNum) || Number.isNaN(calleeIDNum)) {
      return res.status(400).json({ error: 'Invalid phone number' });
    }

    const result = await db
      .insertInto('contact')
      .values({
        owner: userId,
        name,
        countryCode: countryCodeNum,
        calleeID: calleeIDNum,
        createdAt: new Date().toISOString(),
      })
      .executeTakeFirst();

    res.json({
      id: Number(result.insertId),
      message: 'Contact added successfully',
    });
  } catch (error) {
    console.error('Error adding contact:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a contact
router.delete('/api/contacts/:id', async (req, res) => {
  try {
    const userId = await tokenizer(req.cookies.jwt);
    const contactId = Number(req.params.id);

    if (Number.isNaN(contactId)) {
      return res.status(400).json({ error: 'Invalid contact ID' });
    }

    const result = await db
      .deleteFrom('contact')
      .where('id', '=', contactId)
      .where('owner', '=', userId)
      .executeTakeFirst();

    if (Number(result.numDeletedRows) === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as contactsRouter };
