import {
  seedUsers,
  seedJobs,
  seedApplications,
  seedContacts,
  seedSubscribers,
  seedTestimonials,
} from './seedData.js';

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

class MemoryStore {
  constructor() {
    this.users = clone(seedUsers);
    this.jobs = clone(seedJobs);
    this.applications = clone(seedApplications);
    this.contacts = clone(seedContacts);
    this.subscribers = clone(seedSubscribers);
    this.testimonials = clone(seedTestimonials);
  }

  reset() {
    this.users = clone(seedUsers);
    this.jobs = clone(seedJobs);
    this.applications = clone(seedApplications);
    this.contacts = clone(seedContacts);
    this.subscribers = clone(seedSubscribers);
    this.testimonials = clone(seedTestimonials);
  }
}

export const store = new MemoryStore();
