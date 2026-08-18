import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendRoot = path.resolve(__dirname, "..");
const publicDir = path.join(frontendRoot, "public");
const outputPath = path.join(publicDir, "Nir_P_Esh_CV.pdf");
const photoPath = path.join(publicDir, "images", "project4.jpg");

const pageWidth = 595.28;
const pageHeight = 841.89;
const margin = 38; // Increased margin

// Stunning Dark/Neon theme
const bgDark = rgb(0.06, 0.08, 0.12);
const panelDark = rgb(0.11, 0.14, 0.20);
const accentPrimary = rgb(0.0, 0.89, 0.74); // Vibrant Teal
const accentSecondary = rgb(0.48, 0.35, 0.95); // Vibrant Purple
const textTitle = rgb(1, 1, 1);
const textPrimary = rgb(0.9, 0.92, 0.96);
const textSecondary = rgb(0.65, 0.70, 0.78);
const textMuted = rgb(0.45, 0.50, 0.60);
const lineDark = rgb(0.20, 0.24, 0.32);

// Wrap logic
const wrapText = (text, font, size, maxWidth) => {
  const words = text.split(/\s+/);
  const lines = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) <= maxWidth) {
      current = next;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
};

const drawWrappedText = (page, text, font, size, x, y, maxWidth, lineHeight, color = textPrimary) => {
  const lines = wrapText(text, font, size, maxWidth);
  lines.forEach((line, index) => {
    page.drawText(line, {
      x,
      y: y - index * lineHeight,
      size,
      font,
      color,
    });
  });
  return y - (lines.length - 1) * lineHeight;
};

const drawSectionTitle = (page, text, fontBold, x, y, width) => {
  page.drawText(text.toUpperCase(), {
    x,
    y,
    size: 13,
    font: fontBold,
    color: accentPrimary,
    characterSpacing: 2,
  });
  
  // Decorative underline
  page.drawLine({
    start: { x, y: y - 8 },
    end: { x: x + width, y: y - 8 },
    thickness: 1,
    color: lineDark,
  });
  page.drawLine({
    start: { x, y: y - 8 },
    end: { x: x + 50, y: y - 8 },
    thickness: 2.5,
    color: accentSecondary,
  });
  return y - 28;
};

const createPdf = async () => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([pageWidth, pageHeight]);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let photoImage;
  try {
    const photoBytes = fs.readFileSync(photoPath);
    photoImage = await pdfDoc.embedJpg(photoBytes);
  } catch (e) {
    console.log("Photo not found, proceeding without it.");
  }

  // Background Fill
  page.drawRectangle({
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
    color: bgDark,
  });

  // Top Header Area (sleeker)
  page.drawRectangle({
    x: 0,
    y: pageHeight - 195,
    width: pageWidth,
    height: 195,
    color: panelDark,
  });

  // Top accent line
  page.drawRectangle({
    x: 0,
    y: pageHeight - 6,
    width: pageWidth,
    height: 6,
    color: accentPrimary,
  });
  
  // Header details
  page.drawText("NIRPESH", { x: margin, y: pageHeight - 55, size: 42, font: fontBold, color: textTitle });
  page.drawText("DHUNGEL", { x: margin + 185, y: pageHeight - 55, size: 42, font: fontBold, color: accentSecondary });

  page.drawText("CREATIVE FRONTEND DEVELOPER", {
    x: margin + 2,
    y: pageHeight - 80,
    size: 13,
    font: fontBold,
    color: accentPrimary,
    characterSpacing: 2.5,
  });

  drawWrappedText(
    page,
    "Passionate React developer with a strong eye for design. I specialize in building high-performance web applications, dynamic user interfaces, and responsive layouts that bridge the gap between design and engineering.",
    fontRegular,
    10.5,
    margin + 2,
    pageHeight - 105,
    360,
    16,
    textSecondary
  );

  // Profile Image - Make it a perfect square with a beautiful double border
  const imgSize = 100;
  const imgX = pageWidth - margin - imgSize;
  const imgY = pageHeight - margin - imgSize - 20;

  if (photoImage) {
    // Outer border
    page.drawRectangle({
      x: imgX - 4,
      y: imgY - 4,
      width: imgSize + 8,
      height: imgSize + 8,
      color: accentSecondary,
    });
    // Inner border
    page.drawRectangle({
      x: imgX - 1.5,
      y: imgY - 1.5,
      width: imgSize + 3,
      height: imgSize + 3,
      color: panelDark,
    });
    // Image
    page.drawImage(photoImage, {
      x: imgX,
      y: imgY,
      width: imgSize,
      height: imgSize,
    });
  }

  // Contact Info Strip (Below Header)
  page.drawLine({
    start: { x: margin, y: pageHeight - 180 },
    end: { x: pageWidth - margin, y: pageHeight - 180 },
    thickness: 1,
    color: lineDark,
  });

  const contactY = pageHeight - 165;
  const drawContact = (icon, text, xPos) => {
    page.drawText(icon, { x: xPos, y: contactY, size: 9, font: fontBold, color: accentPrimary });
    page.drawText(text, { x: xPos + 25, y: contactY, size: 9.5, font: fontRegular, color: textPrimary });
  };
  
  // Layout contact info horizontally so it doesn't overlap
  drawContact("EMAIL", "nirpeshdhungel7@gmail.com", margin);
  drawContact("LOC", "Nepal (Remote)", margin + 175);
  drawContact("GIT", "github.com/Nirpesh02", margin + 275);
  drawContact("IN", "linkedin.com/in/nirpesh02", margin + 400);

  // -------------------------
  // Main Content Setup
  // -------------------------
  const colGap = 35;
  const col1X = margin;
  const col1W = 165;
  const col2X = col1X + col1W + colGap;
  const col2W = pageWidth - margin * 2 - col1W - colGap;

  let leftY = pageHeight - 235;
  let rightY = pageHeight - 235;

  // -------------------------
  // LEFT COLUMN
  // -------------------------

  // SKILLS
  leftY = drawSectionTitle(page, "Skills", fontBold, col1X, leftY, col1W);
  const skills = [
    { cat: "Frontend", items: "React, Next.js, JavaScript, TypeScript, HTML5, CSS3" },
    { cat: "Styling", items: "Tailwind CSS, SCSS, Framer Motion, UI/UX" },
    { cat: "Backend & DB", items: "Node.js, Express, MongoDB, REST APIs" },
    { cat: "Tools", items: "Git, GitHub, Figma, VS Code" }
  ];

  skills.forEach(skill => {
    page.drawText(skill.cat, { x: col1X, y: leftY, size: 10.5, font: fontBold, color: textPrimary });
    leftY -= 16;
    leftY = drawWrappedText(page, skill.items, fontRegular, 9.5, col1X, leftY, col1W, 14, textSecondary) - 20; // Increased spacing!
  });

  // EDUCATION
  leftY -= 5;
  leftY = drawSectionTitle(page, "Education", fontBold, col1X, leftY, col1W);
  page.drawText("BSc. CSIT", { x: col1X, y: leftY, size: 11, font: fontBold, color: textPrimary });
  leftY -= 15;
  page.drawText("Tribhuvan University", { x: col1X, y: leftY, size: 10, font: fontRegular, color: textSecondary });
  leftY -= 15;
  page.drawText("2022 - 2026", { x: col1X, y: leftY, size: 9.5, font: fontBold, color: accentSecondary });
  leftY -= 25;

  // SERVICES
  leftY = drawSectionTitle(page, "Services", fontBold, col1X, leftY, col1W);
  const services = [
    "Frontend Architecture",
    "UI/UX Implementation",
    "Performance Tuning",
    "Responsive Design",
  ];
  services.forEach((service) => {
    page.drawRectangle({ x: col1X + 2, y: leftY + 2, width: 4, height: 4, color: accentPrimary });
    page.drawText(service, { x: col1X + 14, y: leftY, size: 10, font: fontRegular, color: textSecondary });
    leftY -= 20; // More space
  });

  // -------------------------
  // RIGHT COLUMN
  // -------------------------

  // EXPERIENCE
  rightY = drawSectionTitle(page, "Experience", fontBold, col2X, rightY, col2W);
  
  const drawJob = (title, date, company, bullets) => {
    page.drawText(title, { x: col2X, y: rightY, size: 12, font: fontBold, color: textPrimary });
    page.drawText(date, { x: col2X + col2W - 75, y: rightY, size: 9.5, font: fontBold, color: accentSecondary });
    rightY -= 16;
    page.drawText(company, { x: col2X, y: rightY, size: 10.5, font: fontRegular, color: accentPrimary });
    rightY -= 18;
    
    bullets.forEach(bullet => {
      // Custom bullet point
      page.drawCircle({ x: col2X + 4, y: rightY + 4, size: 2.5, color: accentSecondary });
      rightY = drawWrappedText(page, bullet, fontRegular, 10, col2X + 15, rightY, col2W - 15, 15, textSecondary) - 18; // 18px gap after each bullet block
    });
    rightY -= 10; // Extra gap after job
  };

  drawJob(
    "Freelance Frontend Developer",
    "2024 - Present",
    "Independent / Remote",
    [
      "Designed and developed highly responsive React interfaces for varied client portfolios and business landing pages.",
      "Integrated custom animations using Framer Motion to enhance user engagement and visual storytelling.",
      "Optimized web applications for performance, achieving 90+ Lighthouse scores across accessibility and best practices.",
      "Built reusable UI component libraries with Tailwind CSS, accelerating project development by 30%."
    ]
  );

  drawJob(
    "Web Development Intern",
    "2023 - 2024",
    "Tech Innovations Nepal",
    [
      "Collaborated closely with senior engineers to implement new features for a scalable e-commerce platform.",
      "Refactored legacy CSS into modular Tailwind CSS, significantly improving code maintainability.",
      "Assisted in integrating RESTful backend APIs and managing global state with Redux Toolkit."
    ]
  );

  // PROJECTS
  rightY = drawSectionTitle(page, "Featured Projects", fontBold, col2X, rightY, col2W);
  
  const drawProject = (title, tech, desc) => {
    page.drawText(title, { x: col2X, y: rightY, size: 11.5, font: fontBold, color: textPrimary });
    rightY -= 15;
    page.drawText(tech, { x: col2X, y: rightY, size: 9.5, font: fontBold, color: accentPrimary });
    rightY -= 15;
    rightY = drawWrappedText(page, desc, fontRegular, 10, col2X, rightY, col2W, 15, textSecondary) - 22; // Bigger gap
  };

  drawProject(
    "Hotel Booking System",
    "React, Node.js, MongoDB, Express",
    "Full-featured booking platform supporting real-time availability checking, secure payment integration, and user reviews."
  );

  drawProject(
    "Modern E-Commerce Store",
    "React, Redux, Stripe API, Tailwind",
    "Developed a robust shopping experience with complex product filtering, persistent cart state, and a seamless checkout flow."
  );

  // Footer / Availability
  page.drawRectangle({
    x: 0,
    y: 0,
    width: pageWidth,
    height: 45,
    color: bgDark,
  });
  
  const footerText = "Actively open to new opportunities • Available for freelance and full-time roles";
  const textWidth = fontRegular.widthOfTextAtSize(footerText, 10);
  page.drawText(footerText, {
    x: (pageWidth - textWidth) / 2,
    y: 18,
    size: 10,
    font: fontRegular,
    color: textMuted,
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);
};

createPdf().catch((error) => {
  console.error(error);
  process.exit(1);
});
