const businessData = {
  name: "ABC Computer Repair",
  address: "123 Main St, Seattle, WA, 98109",
  phone: "123-456-7890",
  email: "info@abccr.com",
  website: "http://www.abccr.com",
  hours: "Mon-Fri: 9am - 6pm, Sat: 10am - 4pm, Sun: Closed",
  services: [
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
  ],
  policies: [
    {
      policy_name: "Warranty Policy",
      details: "All repairs come with a 30-day warranty on parts and labor.",
    },
    {
      policy_name: "Cancellation Policy",
      details:
        "Cancellations must be made at least 24 hours in advance to avoid a cancellation fee.",
    },
  ],
  faqs: [
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
  ],
};

export default businessData;
