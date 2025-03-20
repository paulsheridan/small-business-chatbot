// src/seed.ts
import { initializeDatabase } from "./db";

function seed() {
  const db = initializeDatabase();

  // Clear any existing data (optional)
  db.exec("DELETE FROM business_info");
  db.exec("DELETE FROM services");
  db.exec("DELETE FROM policies");
  db.exec("DELETE FROM faqs");

  // Insert business info
  const insertBusiness = db.prepare(
    `INSERT INTO business_info (name, address, phone, email, website, hours) VALUES (?, ?, ?, ?, ?, ?)`,
  );
  insertBusiness.run(
    "Big Tom's Computer Repair",
    "123 Main St, MangoTown, MS, 12345",
    "123-456-7890",
    "info@bigtomcomputers.com",
    "http://www.bigtomcomputers.com",
    "Mon-Fri: 9am - 6pm, Sat: 10am - 4pm, Sun: Closed",
  );

  // Insert sample services
  const insertService = db.prepare(
    `INSERT INTO services (name, description, price) VALUES (?, ?, ?)`,
  );
  const servicesData = [
    {
      name: "Hardware Repair",
      description:
        "Diagnose and repair hardware issues, including screen replacements, battery issues, and more.",
      price: "$100 - $300",
    },
    {
      name: "Software Troubleshooting",
      description:
        "Resolve software problems, including virus removal, OS reinstallation, and optimization.",
      price: "$50 - $150",
    },
    {
      name: "Data Recovery",
      description:
        "Recover lost data from hard drives, SSDs, and other storage devices.",
      price: "$200 - $500",
    },
  ];

  for (const service of servicesData) {
    insertService.run(service.name, service.description, service.price);
  }

  // Insert sample policies
  const insertPolicy = db.prepare(
    `INSERT INTO policies (policy_name, details) VALUES (?, ?)`,
  );
  const policiesData = [
    {
      policy_name: "Warranty Policy",
      details: "All repairs come with a 30-day warranty on parts and labor.",
    },
    {
      policy_name: "Cancellation Policy",
      details:
        "Cancellations must be made at least 24 hours in advance to avoid a cancellation fee.",
    },
  ];

  for (const policy of policiesData) {
    insertPolicy.run(policy.policy_name, policy.details);
  }

  // Insert sample FAQs
  const insertFaq = db.prepare(
    `INSERT INTO faqs (question, answer) VALUES (?, ?)`,
  );
  const faqsData = [
    {
      question: "How long does a typical repair take?",
      answer:
        "Most repairs are completed within 2-3 business days, depending on the complexity of the issue.",
    },
    {
      question: "Do you offer on-site repairs?",
      answer:
        "Yes, we offer on-site repairs within a 20-mile radius for an additional fee.",
    },
  ];

  for (const faq of faqsData) {
    insertFaq.run(faq.question, faq.answer);
  }

  console.log("Database seeding complete.");
  process.exit(0);
}

seed();
