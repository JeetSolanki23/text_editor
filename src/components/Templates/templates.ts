export const RESUME_TEMPLATE = `
  <h1 style="text-align: center">YOUR NAME</h1>
  <p style="text-align: center">Email: name@example.com | Phone: (123) 456-7890 | LinkedIn: linkedin.com/in/username</p>
  <hr />
  <h2>Experience</h2>
  <h3>Job Title | Company Name | 2020 – Present</h3>
  <ul>
    <li>Accomplishment 1: Described with metrics if possible.</li>
    <li>Accomplishment 2: Highlighted key skills used.</li>
  </ul>
  <h3>Previous Job | Company Name | 2018 – 2020</h3>
  <ul>
    <li>Accomplishment 1.</li>
    <li>Accomplishment 2.</li>
  </ul>
  <hr />
  <h2>Education</h2>
  <p><strong>University Name</strong> | Degree Name | Graduation Date</p>
  <hr />
  <h2>Skills</h2>
  <p>React, TypeScript, Tailwind CSS, Tiptap, Node.js, Project Management</p>
`;

export const INVOICE_TEMPLATE = `
  <h1 style="text-align: right">INVOICE</h1>
  <p style="text-align: right">Invoice #: 1001<br>Date: ${new Date().toLocaleDateString()}</p>

  <table style="width: 100%">
    <tr>
      <td>
        <strong>From:</strong><br>
        Your Company Name<br>
        123 Business St<br>
        City, State, Zip
      </td>
      <td>
        <strong>To:</strong><br>
        Client Name<br>
        456 Client Rd<br>
        City, State, Zip
      </td>
    </tr>
  </table>

  <br>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th>Quantity</th>
        <th>Price</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Web Design Services</td>
        <td>1</td>
        <td>$1,500.00</td>
        <td>$1,500.00</td>
      </tr>
      <tr>
        <td>SEO Optimization</td>
        <td>5 hours</td>
        <td>$100.00</td>
        <td>$500.00</td>
      </tr>
    </tbody>
  </table>

  <p style="text-align: right"><strong>Grand Total: $2,000.00</strong></p>
`;

export const REPORT_TEMPLATE = `
  <h1 style="text-align: center">Project Status Report</h1>
  <p style="text-align: center">Prepared by: [Your Name] | Date: ${new Date().toLocaleDateString()}</p>

  <h2>1. Executive Summary</h2>
  <p>Provide a high-level overview of the project status, key achievements, and any critical issues.</p>

  <h2>2. Key Milestones</h2>
  <table>
    <thead>
      <tr>
        <th>Milestone</th>
        <th>Target Date</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Design Phase</td>
        <td>2023-10-01</td>
        <td>Completed</td>
      </tr>
      <tr>
        <td>Development</td>
        <td>2023-12-15</td>
        <td>In Progress</td>
      </tr>
    </tbody>
  </table>

  <h2>3. Next Steps</h2>
  <ul>
    <li>Complete frontend integration.</li>
    <li>Start backend API development.</li>
    <li>Conduct user acceptance testing.</li>
  </ul>
`;
