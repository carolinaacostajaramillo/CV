import { generatePDF } from "../script"

export default function SyntheticV0PageForDeployment() {
  return (
    <div>
      <button onClick={() => generatePDF("resume")}>Generate Resume</button>
      <button onClick={() => generatePDF("cv")}>Generate CV</button>
      <button onClick={() => generatePDF("coverLetter")}>Generate Cover Letter</button>
    </div>
  )
}

