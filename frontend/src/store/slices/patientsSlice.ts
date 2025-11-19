import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { PatientService } from '@/services/patientService'
import type { Patient, PatientCreateRequest, PatientUpdateRequest } from '@/types/patient'

export const fetchPatients = createAsyncThunk(
  'patients/fetchPatients',
  async (_, { rejectWithValue }) => {
    try {
      return await PatientService.getAll()
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch patients')
    }
  }
)

export const fetchPatientById = createAsyncThunk(
  'patients/fetchPatientById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await PatientService.getById(id)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch patient')
    }
  }
)

export const createPatient = createAsyncThunk(
  'patients/createPatient',
  async (patientData: PatientCreateRequest, { rejectWithValue }) => {
    try {
      return await PatientService.create(patientData)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create patient')
    }
  }
)

export const updatePatient = createAsyncThunk(
  'patients/updatePatient',
  async ({ id, data }: { id: string; data: PatientUpdateRequest }, { rejectWithValue }) => {
    try {
      return await PatientService.update(id, data)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update patient')
    }
  }
)

export const deletePatient = createAsyncThunk(
  'patients/deletePatient',
  async (id: string, { rejectWithValue }) => {
    try {
      await PatientService.delete(id)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete patient')
    }
  }
)

interface PatientsState {
  patients: Patient[]
  currentPatient: Patient | null
  loading: boolean
  error: string | null
  createLoading: boolean
  updateLoading: boolean
  deleteLoading: boolean
}

const initialState: PatientsState = {
  patients: [],
  currentPatient: null,
  loading: false,
  error: null,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
}

const patientsSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentPatient: (state) => {
      state.currentPatient = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPatients.fulfilled, (state, action: PayloadAction<Patient[]>) => {
        state.loading = false
        state.patients = action.payload
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    builder
      .addCase(fetchPatientById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPatientById.fulfilled, (state, action: PayloadAction<Patient>) => {
        state.loading = false
        state.currentPatient = action.payload
      })
      .addCase(fetchPatientById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    builder
      .addCase(createPatient.pending, (state) => {
        state.createLoading = true
        state.error = null
      })
      .addCase(createPatient.fulfilled, (state, action: PayloadAction<Patient>) => {
        state.createLoading = false
        state.patients.push(action.payload)
      })
      .addCase(createPatient.rejected, (state, action) => {
        state.createLoading = false
        state.error = action.payload as string
      })

    builder
      .addCase(updatePatient.pending, (state) => {
        state.updateLoading = true
        state.error = null
      })
      .addCase(updatePatient.fulfilled, (state, action: PayloadAction<Patient>) => {
        state.updateLoading = false
        const index = state.patients.findIndex(p => p._id === action.payload._id)
        if (index !== -1) {
          state.patients[index] = action.payload
        }
        state.currentPatient = action.payload
      })
      .addCase(updatePatient.rejected, (state, action) => {
        state.updateLoading = false
        state.error = action.payload as string
      })

    builder
      .addCase(deletePatient.pending, (state) => {
        state.deleteLoading = true
        state.error = null
      })
      .addCase(deletePatient.fulfilled, (state, action: PayloadAction<string>) => {
        state.deleteLoading = false
        state.patients = state.patients.filter(p => p._id !== action.payload)
      })
      .addCase(deletePatient.rejected, (state, action) => {
        state.deleteLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, clearCurrentPatient } = patientsSlice.actions
export default patientsSlice.reducer
