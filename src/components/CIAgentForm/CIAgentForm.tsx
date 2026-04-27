import { useState, FormEvent, ChangeEvent } from 'react'
import styles from './CIAgentForm.module.css'

interface CIAgentFormProps {
  onSuccess: () => void
  onBack: () => void
}

interface FormData {
  assetId: string
  githubRepository: string
  githubPAT: string
  gpgKey: string
  appName: string
  techStack: string
  artifactoryUsername: string
  artifactoryApiKey: string
  version: string
  sonarProjectKey: string
  sonarProjectName: string
  sonarToken: string
  sonarHostUrl: string
  snykToken: string
  file: File | null
}

export function CIAgentForm({ onSuccess, onBack }: CIAgentFormProps) {
  const [formData, setFormData] = useState<FormData>({
    assetId: '',
    githubRepository: '',
    githubPAT: '',
    gpgKey: '',
    appName: '',
    techStack: '',
    artifactoryUsername: '',
    artifactoryApiKey: '',
    version: '',
    sonarProjectKey: '',
    sonarProjectName: '',
    sonarToken: '',
    sonarHostUrl: '',
    snykToken: '',
    file: null,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [fileError, setFileError] = useState<string>('')
  const [showSuccess, setShowSuccess] = useState(false)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setFileError('')

    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png']
      if (!validTypes.includes(file.type)) {
        setFileError('Only JPEG and PNG files are allowed')
        e.target.value = ''
        return
      }

      // Validate file size (5 MB = 5 * 1024 * 1024 bytes)
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        setFileError('File size must not exceed 5 MB')
        e.target.value = ''
        return
      }

      setFormData((prev) => ({ ...prev, file }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validate all required fields
    if (!formData.assetId.trim()) newErrors.assetId = 'Asset ID is required'
    if (!formData.githubRepository.trim())
      newErrors.githubRepository = 'GitHub Repository is required'
    if (!formData.githubPAT.trim())
      newErrors.githubPAT = 'GitHub PAT is required'
    if (!formData.gpgKey.trim()) newErrors.gpgKey = 'GPG Key is required'
    if (!formData.appName.trim()) newErrors.appName = 'App Name is required'
    if (!formData.techStack.trim())
      newErrors.techStack = 'Tech Stack is required'
    if (!formData.artifactoryUsername.trim())
      newErrors.artifactoryUsername = 'Artifactory Username is required'
    if (!formData.artifactoryApiKey.trim())
      newErrors.artifactoryApiKey = 'Artifactory API Key is required'
    if (!formData.version.trim()) newErrors.version = 'Version is required'
    if (!formData.sonarProjectKey.trim())
      newErrors.sonarProjectKey = 'Sonar Project Key is required'
    if (!formData.sonarProjectName.trim())
      newErrors.sonarProjectName = 'Sonar Project Name is required'
    if (!formData.sonarToken.trim())
      newErrors.sonarToken = 'Sonar Token is required'
    if (!formData.sonarHostUrl.trim())
      newErrors.sonarHostUrl = 'Sonar Host URL is required'
    if (!formData.snykToken.trim())
      newErrors.snykToken = 'Snyk Token is required'
    if (!formData.file) newErrors.file = 'File is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      // Show success message
      setShowSuccess(true)

      // Redirect to welcome page after 2 seconds
      setTimeout(() => {
        onSuccess()
      }, 2000)
    }
  }

  const handleReset = () => {
    setFormData({
      assetId: '',
      githubRepository: '',
      githubPAT: '',
      gpgKey: '',
      appName: '',
      techStack: '',
      artifactoryUsername: '',
      artifactoryApiKey: '',
      version: '',
      sonarProjectKey: '',
      sonarProjectName: '',
      sonarToken: '',
      sonarHostUrl: '',
      snykToken: '',
      file: null,
    })
    setErrors({})
    setFileError('')
    // Reset file input
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  if (showSuccess) {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successMessage}>
          <h2>✓ Success!</h2>
          <p>CI Agent configuration has been submitted successfully.</p>
          <p>Redirecting to welcome page...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <button onClick={onBack} className={styles.backButton}>
        ← Back to agents
      </button>

      <div className={styles.header}>
        <div className={styles.badge}>CONFIGURED INTAKE</div>
        <h1 className={styles.title}>CI Agent</h1>
        <p className={styles.subtitle}>
          Capture CI onboarding details and required credentials.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          {/* Row 1 */}
          <div className={styles.formField}>
            <label htmlFor="assetId">
              Asset ID <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="assetId"
              name="assetId"
              value={formData.assetId}
              onChange={handleInputChange}
              placeholder="Enter Asset ID"
              className={errors.assetId ? styles.inputError : ''}
            />
            {errors.assetId && (
              <span className={styles.errorText}>{errors.assetId}</span>
            )}
          </div>

          <div className={styles.formField}>
            <label htmlFor="githubRepository">
              GitHub Repository <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="githubRepository"
              name="githubRepository"
              value={formData.githubRepository}
              onChange={handleInputChange}
              placeholder="Git Repository URL"
              className={errors.githubRepository ? styles.inputError : ''}
            />
            {errors.githubRepository && (
              <span className={styles.errorText}>
                {errors.githubRepository}
              </span>
            )}
          </div>

          <div className={styles.formField}>
            <label htmlFor="githubPAT">
              GitHub PAT <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="githubPAT"
              name="githubPAT"
              value={formData.githubPAT}
              onChange={handleInputChange}
              placeholder="Enter GitHub personal access token"
              className={errors.githubPAT ? styles.inputError : ''}
            />
            {errors.githubPAT && (
              <span className={styles.errorText}>{errors.githubPAT}</span>
            )}
          </div>

          {/* Row 2 - Full width */}
          <div className={styles.formFieldFull}>
            <label htmlFor="gpgKey">
              GPG Key <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="gpgKey"
              name="gpgKey"
              value={formData.gpgKey}
              onChange={handleInputChange}
              placeholder="Paste GPG key"
              className={errors.gpgKey ? styles.inputError : ''}
            />
            {errors.gpgKey && (
              <span className={styles.errorText}>{errors.gpgKey}</span>
            )}
          </div>

          {/* Row 3 */}
          <div className={styles.formField}>
            <label htmlFor="appName">
              App Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="appName"
              name="appName"
              value={formData.appName}
              onChange={handleInputChange}
              placeholder="Enter application name"
              className={errors.appName ? styles.inputError : ''}
            />
            {errors.appName && (
              <span className={styles.errorText}>{errors.appName}</span>
            )}
          </div>

          <div className={styles.formField}>
            <label htmlFor="techStack">
              Tech Stack <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="techStack"
              name="techStack"
              value={formData.techStack}
              onChange={handleInputChange}
              placeholder="e.g. Java, Node.js, Python"
              className={errors.techStack ? styles.inputError : ''}
            />
            {errors.techStack && (
              <span className={styles.errorText}>{errors.techStack}</span>
            )}
          </div>

          <div className={styles.formField}>
            <label htmlFor="artifactoryUsername">
              Artifactory Username <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="artifactoryUsername"
              name="artifactoryUsername"
              value={formData.artifactoryUsername}
              onChange={handleInputChange}
              placeholder="Enter Artifactory username"
              className={errors.artifactoryUsername ? styles.inputError : ''}
            />
            {errors.artifactoryUsername && (
              <span className={styles.errorText}>
                {errors.artifactoryUsername}
              </span>
            )}
          </div>

          {/* Row 4 */}
          <div className={styles.formField}>
            <label htmlFor="artifactoryApiKey">
              Artifactory API Key <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="artifactoryApiKey"
              name="artifactoryApiKey"
              value={formData.artifactoryApiKey}
              onChange={handleInputChange}
              placeholder="Enter Artifactory API key"
              className={errors.artifactoryApiKey ? styles.inputError : ''}
            />
            {errors.artifactoryApiKey && (
              <span className={styles.errorText}>
                {errors.artifactoryApiKey}
              </span>
            )}
          </div>

          <div className={styles.formField}>
            <label htmlFor="version">
              Version <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="version"
              name="version"
              value={formData.version}
              onChange={handleInputChange}
              placeholder="Enter version"
              className={errors.version ? styles.inputError : ''}
            />
            {errors.version && (
              <span className={styles.errorText}>{errors.version}</span>
            )}
          </div>

          <div className={styles.formField}>
            <label htmlFor="sonarProjectKey">
              Sonar Project Key <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="sonarProjectKey"
              name="sonarProjectKey"
              value={formData.sonarProjectKey}
              onChange={handleInputChange}
              placeholder="Enter Sonar project key"
              className={errors.sonarProjectKey ? styles.inputError : ''}
            />
            {errors.sonarProjectKey && (
              <span className={styles.errorText}>
                {errors.sonarProjectKey}
              </span>
            )}
          </div>

          {/* Row 5 */}
          <div className={styles.formField}>
            <label htmlFor="sonarProjectName">
              Sonar Project Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="sonarProjectName"
              name="sonarProjectName"
              value={formData.sonarProjectName}
              onChange={handleInputChange}
              placeholder="Enter Sonar project name"
              className={errors.sonarProjectName ? styles.inputError : ''}
            />
            {errors.sonarProjectName && (
              <span className={styles.errorText}>
                {errors.sonarProjectName}
              </span>
            )}
          </div>

          <div className={styles.formField}>
            <label htmlFor="sonarToken">
              Sonar Token <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="sonarToken"
              name="sonarToken"
              value={formData.sonarToken}
              onChange={handleInputChange}
              placeholder="Enter Sonar token"
              className={errors.sonarToken ? styles.inputError : ''}
            />
            {errors.sonarToken && (
              <span className={styles.errorText}>{errors.sonarToken}</span>
            )}
          </div>

          <div className={styles.formField}>
            <label htmlFor="sonarHostUrl">
              Sonar Host URL <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="sonarHostUrl"
              name="sonarHostUrl"
              value={formData.sonarHostUrl}
              onChange={handleInputChange}
              placeholder="https://sonar.example.com"
              className={errors.sonarHostUrl ? styles.inputError : ''}
            />
            {errors.sonarHostUrl && (
              <span className={styles.errorText}>{errors.sonarHostUrl}</span>
            )}
          </div>

          {/* Row 6 - Snyk Token */}
          <div className={styles.formFieldHalf}>
            <label htmlFor="snykToken">
              Snyk Token <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="snykToken"
              name="snykToken"
              value={formData.snykToken}
              onChange={handleInputChange}
              placeholder="Enter Snyk token"
              className={errors.snykToken ? styles.inputError : ''}
            />
            {errors.snykToken && (
              <span className={styles.errorText}>{errors.snykToken}</span>
            )}
          </div>

          {/* Row 7 - File Upload */}
          <div className={styles.formFieldFull}>
            <label htmlFor="file">
              Files <span className={styles.required}>*</span>
            </label>
            <input
              type="file"
              id="file"
              name="file"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png"
              className={errors.file || fileError ? styles.inputError : ''}
            />
            <p className={styles.fileHint}>
              Maximum size per file: 5 MB. Accepted formats: JPEG, PNG
            </p>
            {(errors.file || fileError) && (
              <span className={styles.errorText}>
                {errors.file || fileError}
              </span>
            )}
          </div>
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.submitButton}>
            Submit
          </button>
          <button
            type="button"
            onClick={handleReset}
            className={styles.resetButton}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  )
}
