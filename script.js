document.addEventListener("DOMContentLoaded", (event) => {
  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      })
    })
  })

  // Add dark mode toggle
  const body = document.body
  const darkModeToggle = document.createElement("button")
  darkModeToggle.textContent = "Toggle Dark Mode"
  darkModeToggle.className = "dark-mode-toggle"
  darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>'
  body.appendChild(darkModeToggle)

  darkModeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode")
    if (body.classList.contains("dark-mode")) {
      document.documentElement.style.setProperty("--text-color", "#f4f4f4")
      document.documentElement.style.setProperty("--background-color", "#333")
    } else {
      document.documentElement.style.setProperty("--text-color", "#333")
      document.documentElement.style.setProperty("--background-color", "#f0f4f8")
    }
  })

  // Fade-in animation
  const fadeElements = document.querySelectorAll(".fade-in")

  const fadeInObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible")
        }
      })
    },
    { threshold: 0.1 },
  )

  fadeElements.forEach((element) => {
    fadeInObserver.observe(element)
  })

  // PDF generation functions
  function generatePDF(type) {
    // Initialize jsPDF
    const { jsPDF } = window.jspdf

    // Create new document with letter size in mm
    const doc = new jsPDF({
      format: "letter",
      unit: "mm",
    })

    // Define constants for layout
    const margins = 25.4 // 1 inch margins
    const pageWidth = 215.9 // Letter width in mm
    const contentWidth = pageWidth - margins * 2
    let yPos = margins

    // Header
    doc.setFont("helvetica", "bold")
    doc.setFontSize(16)
    doc.text("Carolina Acosta Jaramillo", pageWidth / 2, yPos, { align: "center" })
    yPos += 8

    doc.setFont("helvetica", "normal")
    doc.setFontSize(12)
    doc.text("Music Educator", pageWidth / 2, yPos, { align: "center" })
    yPos += 15

    if (type === "resume" || type === "cv") {
      // Professional Summary
      yPos = addSectionWithTitle(
        doc,
        "Professional Summary",
        document.querySelector("#summary p").textContent,
        yPos,
        margins,
        contentWidth,
      )
      yPos += 10

      // Education
      doc.setFont("helvetica", "bold")
      doc.setFontSize(14)
      doc.text("Education", margins, yPos)
      yPos += 8

      const educationItems = document.querySelectorAll(".education-item")
      educationItems.forEach((item) => {
        doc.setFont("helvetica", "bold")
        doc.setFontSize(12)
        doc.text(item.querySelector("h3").textContent, margins, yPos)
        yPos += 5

        doc.setFont("helvetica", "normal")
        doc.setFontSize(11)
        const institution = item.querySelectorAll("p")[0].textContent.replace(/\s*\u{1F393}\s*/u, "")
        const graduation = item.querySelectorAll("p")[1].textContent.replace(/\s*\u{1F393}\s*/u, "")

        doc.text(institution, margins, yPos)
        yPos += 5
        doc.text(graduation, margins, yPos)
        yPos += 8
      })

      yPos += 5

      // Professional Experience
      if (yPos > 240) {
        doc.addPage()
        yPos = margins
      }

      doc.setFont("helvetica", "bold")
      doc.setFontSize(14)
      doc.text("Professional Experience", margins, yPos)
      yPos += 8

      const experienceItems = document.querySelectorAll(".experience-item")
      experienceItems.forEach((item) => {
        if (yPos > 240) {
          doc.addPage()
          yPos = margins
        }

        // Job Title
        doc.setFont("helvetica", "bold")
        doc.setFontSize(12)
        doc.text(item.querySelector("h3").textContent, margins, yPos)
        yPos += 5

        // Company and Date
        doc.setFont("helvetica", "normal")
        doc.setFontSize(11)
        const company = item.querySelectorAll("p")[0].textContent.replace(/\s*\u{1F3E2}\s*/u, "")
        const date = item.querySelectorAll("p")[1].textContent.replace(/\s*\u{1F4C5}\s*/u, "")

        doc.text(company, margins, yPos)
        yPos += 5
        doc.text(date, margins, yPos)
        yPos += 6

        // Responsibilities
        const responsibilities = Array.from(item.querySelectorAll("li"))
        responsibilities.forEach((li) => {
          if (yPos > 240) {
            doc.addPage()
            yPos = margins
          }
          const bulletText = "• " + li.textContent
          const splitBullet = doc.splitTextToSize(bulletText, contentWidth - 10)
          doc.text(splitBullet, margins + 5, yPos)
          yPos += splitBullet.length * 5
        })
        yPos += 8
      })

      // Skills
      if (yPos > 240) {
        doc.addPage()
        yPos = margins
      }

      doc.setFont("helvetica", "bold")
      doc.setFontSize(14)
      doc.text("Skills & Competencies", margins, yPos)
      yPos += 8

      doc.setFont("helvetica", "normal")
      doc.setFontSize(11)
      const skillsText = Array.from(document.querySelectorAll(".skills-list li"))
        .map((li) =>
          li.textContent.replace(
            /^\s*[\u{1F3BC}\u{1F4DA}\u{1F310}\u{1F465}\u{1F4CB}\u{1F4BB}\u{1F6E0}\u{1F4C5}\u{1F4C8}\u{1F4AC}\u{1F3EB}\u{1F4BB}\u{267F}\u{1F476}]\s*/u,
            "",
          ),
        )
        .join(", ")
      const splitSkills = doc.splitTextToSize(skillsText, contentWidth)
      doc.text(splitSkills, margins, yPos)
    } else if (type === "coverLetter") {
      const companyName = prompt("Please enter the school or institution name for the cover letter:")
      if (!companyName) return

      // Reset to starting position with proper margins
      yPos = 25.4 // 1 inch margin
      const leftMargin = 25.4
      const rightMargin = pageWidth - 25.4
      const textWidth = rightMargin - leftMargin

      // Header section
      doc.setFont("helvetica", "bold")
      doc.setFontSize(16)
      doc.text("Carolina Acosta Jaramillo", pageWidth / 2, yPos, { align: "center" })
      yPos += 8

      doc.setFont("helvetica", "normal")
      doc.setFontSize(12)
      doc.text("Music Educator", pageWidth / 2, yPos, { align: "center" })
      yPos += 12

      doc.setFont("helvetica", "bold")
      doc.setFontSize(14)
      doc.text("Cover Letter", pageWidth / 2, yPos, { align: "center" })
      yPos += 15

      // Letter content
      doc.setFont("helvetica", "normal")
      doc.setFontSize(12)

      // Greeting
      doc.text("Dear Hiring Manager,", leftMargin, yPos)
      yPos += 12

      // First paragraph with text wrapping
      const firstParagraph = "I am writing to express my strong interest in the Senior Music Teacher position at [SCHOOL]. With over a decade of experience in music education and a proven track record of developing comprehensive curricula aligned with international standards including ABRSM and Trinity College London syllabi, I believe I would be a valuable addition to your music department."
      
      // Replace placeholder with actual school name
      const lines1 = doc.splitTextToSize(firstParagraph.replace("[SCHOOL]", " "+companyName), textWidth)
      
      // Find the line containing the school name
      const schoolIndex = lines1.findIndex(line => line.includes(companyName))
      if (schoolIndex !== -1) {
        // For each line
        lines1.forEach((line, index) => {
          if (index === schoolIndex) {
            // For the line with school name, split and render with bold school name
            const parts = line.split(companyName)
            let xPosition = leftMargin
            
            doc.setFont("helvetica", "normal")
            doc.text(parts[0], xPosition, yPos)
            xPosition += doc.getTextWidth(parts[0])
            
            doc.setFont("helvetica", "bold")
            doc.text(companyName, xPosition, yPos)
            xPosition += doc.getTextWidth(companyName)
            
            doc.setFont("helvetica", "normal")
            if (parts[1]) doc.text(parts[1], xPosition, yPos)
          } else {
            // For other lines, render normally
            doc.setFont("helvetica", "normal")
            doc.text(line, leftMargin, yPos)
          }
          yPos += 5
        })
      }
      yPos += 8

      // Second paragraph
      const paragraph2 = "My background includes leading music education programmes across various age groups, fostering student engagement through innovative teaching methods, and successfully integrating both traditional and contemporary approaches to music education. I have extensive experience in organizing school concerts, directing musical productions, and creating cross-cultural learning experiences that enhance students' global awareness and appreciation for music."
      const lines2 = doc.splitTextToSize(paragraph2, textWidth)
      doc.text(lines2, leftMargin, yPos, { align: "justify", maxWidth: textWidth })
      yPos += lines2.length * 5 + 8

      // Third paragraph with text wrapping
      const thirdParagraph = "I am particularly excited about the opportunity to bring my expertise in both classical and contemporary music education techniques to [SCHOOL], along with my experience in implementing internationally recognized music examination systems."
      
      // Replace placeholder with actual school name
      const lines3 = doc.splitTextToSize(thirdParagraph.replace("[SCHOOL]", companyName), textWidth)
      
      // Find the line containing the school name
      const schoolIndex3 = lines3.findIndex(line => line.includes(companyName))
      if (schoolIndex3 !== -1) {
        // For each line
        lines3.forEach((line, index) => {
          if (index === schoolIndex3) {
            // For the line with school name, split and render with bold school name
            const parts = line.split(companyName)
            let xPosition = leftMargin
            
            doc.setFont("helvetica", "normal")
            doc.text(parts[0], xPosition, yPos)
            xPosition += doc.getTextWidth(parts[0])
            
            doc.setFont("helvetica", "bold")
            doc.text(companyName, xPosition, yPos)
            xPosition += doc.getTextWidth(companyName)
            
            doc.setFont("helvetica", "normal")
            if (parts[1]) doc.text(parts[1], xPosition, yPos)
          } else {
            // For other lines, render normally
            doc.setFont("helvetica", "normal")
            doc.text(line, leftMargin, yPos)
          }
          yPos += 5
        })
      }
      yPos += 8

      // Fourth paragraph
      const paragraph4 = "Thank you for your consideration. I look forward to discussing how my skills and experience in music education align with your institution's needs."
      const lines4 = doc.splitTextToSize(paragraph4, textWidth)
      doc.text(lines4, leftMargin, yPos, { align: "justify", maxWidth: textWidth })
      yPos += lines4.length * 5 + 12

      // Signature
      doc.text("Sincerely,", leftMargin, yPos)
      yPos += 8
      doc.setFont("helvetica", "bold")
      doc.text("Carolina Acosta Jaramillo", leftMargin, yPos)
    }

    // Save the PDF
    try {
      doc.save(`Carolina_Acosta_Jaramillo_${type}.pdf`)
    } catch (error) {
      console.error("Error saving PDF:", error)
    }
  }

  function addSectionWithTitle(doc, title, content, yPos, margins, contentWidth) {
    doc.setFont("helvetica", "bold")
    doc.setFontSize(14)
    doc.text(title, margins, yPos)
    yPos += 8

    doc.setFont("helvetica", "normal")
    doc.setFontSize(11)
    const splitContent = doc.splitTextToSize(content, contentWidth)
    doc.text(splitContent, margins, yPos)
    return yPos + splitContent.length * 5
  }

  // Event listeners for download buttons
  document.getElementById("downloadResume").addEventListener("click", () => generatePDF("resume"))
  document.getElementById("downloadCV").addEventListener("click", () => generatePDF("cv"))
  document.getElementById("downloadCoverLetter").addEventListener("click", () => generatePDF("coverLetter"))
})