import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

/** Save a captured face image as a reference (registration) */
export async function captureRegister(blob) {
  const form = new FormData()
  form.append('file', blob, 'capture.jpg')
  const { data } = await api.post('/register/capture', form)
  return data
}

/** Get the current registration status (count of saved images) */
export async function getRegisterStatus() {
  const { data } = await api.get('/register/status')
  return data
}

/** Delete all registered reference images */
export async function resetRegistration() {
  const { data } = await api.delete('/register/reset')
  return data
}

/** Verify a captured face image against registered references */
export async function verifyFace(blob) {
  const form = new FormData()
  form.append('file', blob, 'verify.jpg')
  const { data } = await api.post('/verify', form)
  return data
}


/** Start model training */
export async function startTraining() {
  const { data } = await api.post('/train/start')
  return data
}

/** Get current training status */
export async function getTrainingStatus() {
  const { data } = await api.get('/train/status')
  return data
}
