import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { AppointmentService } from "@/services/appointmentService";
import type {
  Appointment,
  AppointmentCreateRequest,
  AppointmentUpdateRequest,
} from "@/types/appointment";

export const fetchAppointments = createAsyncThunk(
  "appointments/fetchAppointments",
  async (_, { rejectWithValue }) => {
    try {
      return await AppointmentService.getAll();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch appointments"
      );
    }
  }
);

export const fetchAppointmentById = createAsyncThunk(
  "appointments/fetchAppointmentById",
  async (id: string, { rejectWithValue }) => {
    try {
      return await AppointmentService.getById(id);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch appointment"
      );
    }
  }
);

export const fetchAppointmentsByPatient = createAsyncThunk(
  "appointments/fetchAppointmentsByPatient",
  async (patientId: string, { rejectWithValue }) => {
    try {
      return await AppointmentService.getByPatient(patientId);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch patient appointments"
      );
    }
  }
);

export const createAppointment = createAsyncThunk(
  "appointments/createAppointment",
  async (appointmentData: AppointmentCreateRequest, { rejectWithValue }) => {
    try {
      return await AppointmentService.create(appointmentData);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create appointment"
      );
    }
  }
);

export const updateAppointment = createAsyncThunk(
  "appointments/updateAppointment",
  async (
    { id, data }: { id: string; data: AppointmentUpdateRequest },
    { rejectWithValue }
  ) => {
    try {
      return await AppointmentService.update(id, data);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update appointment"
      );
    }
  }
);

export const cancelAppointment = createAsyncThunk(
  "appointments/cancelAppointment",
  async (id: string, { rejectWithValue }) => {
    try {
      return await AppointmentService.cancel(id);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to cancel appointment"
      );
    }
  }
);

export const completeAppointment = createAsyncThunk(
  "appointments/completeAppointment",
  async (id: string, { rejectWithValue }) => {
    try {
      return await AppointmentService.complete(id);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to complete appointment"
      );
    }
  }
);

export const deleteAppointment = createAsyncThunk(
  "appointments/deleteAppointment",
  async (id: string, { rejectWithValue }) => {
    try {
      await AppointmentService.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete appointment"
      );
    }
  }
);

interface AppointmentsState {
  appointments: Appointment[];
  currentAppointment: Appointment | null;
  loading: boolean;
  error: string | null;
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
  cancelLoading: boolean;
  completeLoading: boolean;
}

const initialState: AppointmentsState = {
  appointments: [],
  currentAppointment: null,
  loading: false,
  error: null,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  cancelLoading: false,
  completeLoading: false,
};

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentAppointment: (state) => {
      state.currentAppointment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAppointments.fulfilled,
        (state, action: PayloadAction<Appointment[]>) => {
          state.loading = false;
          state.appointments = action.payload;
        }
      )
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchAppointmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAppointmentById.fulfilled,
        (state, action: PayloadAction<Appointment>) => {
          state.loading = false;
          state.currentAppointment = action.payload;
        }
      )
      .addCase(fetchAppointmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchAppointmentsByPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAppointmentsByPatient.fulfilled,
        (state, action: PayloadAction<Appointment[]>) => {
          state.loading = false;
          state.appointments = action.payload;
        }
      )
      .addCase(fetchAppointmentsByPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(createAppointment.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(
        createAppointment.fulfilled,
        (state, action: PayloadAction<Appointment>) => {
          state.createLoading = false;
          state.appointments.push(action.payload);
        }
      )
      .addCase(createAppointment.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(updateAppointment.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(
        updateAppointment.fulfilled,
        (state, action: PayloadAction<Appointment>) => {
          state.updateLoading = false;
          const index = state.appointments.findIndex(
            (a) => a._id === action.payload._id
          );
          if (index !== -1) {
            state.appointments[index] = action.payload;
          }
          state.currentAppointment = action.payload;
        }
      )
      .addCase(updateAppointment.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(cancelAppointment.pending, (state) => {
        state.cancelLoading = true;
        state.error = null;
      })
      .addCase(
        cancelAppointment.fulfilled,
        (state, action: PayloadAction<Appointment>) => {
          state.cancelLoading = false;
          const index = state.appointments.findIndex(
            (a) => a._id === action.payload._id
          );
          if (index !== -1) {
            state.appointments[index] = action.payload;
          }
          state.currentAppointment = action.payload;
        }
      )
      .addCase(cancelAppointment.rejected, (state, action) => {
        state.cancelLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(completeAppointment.pending, (state) => {
        state.completeLoading = true;
        state.error = null;
      })
      .addCase(
        completeAppointment.fulfilled,
        (state, action: PayloadAction<Appointment>) => {
          state.completeLoading = false;
          const index = state.appointments.findIndex(
            (a) => a._id === action.payload._id
          );
          if (index !== -1) {
            state.appointments[index] = action.payload;
          }
          state.currentAppointment = action.payload;
        }
      )
      .addCase(completeAppointment.rejected, (state, action) => {
        state.completeLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(deleteAppointment.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(
        deleteAppointment.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.deleteLoading = false;
          state.appointments = state.appointments.filter(
            (a) => a._id !== action.payload
          );
        }
      )
      .addCase(deleteAppointment.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentAppointment } =
  appointmentsSlice.actions;
export default appointmentsSlice.reducer;
