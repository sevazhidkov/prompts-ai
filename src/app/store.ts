import { configureStore, ThunkAction, Action, combineReducers, getDefaultMiddleware } from '@reduxjs/toolkit';
import { persistStore, persistReducer, createMigrate } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import counterReducer from '../components/counter/counterSlice';
import editorReducer from './slices/editorSlice';

const reducers = combineReducers(
    {
      counter: counterReducer,
      editor: editorReducer
    }
);

const migrations = {
    0: (state: any) => {
        return {
            ...state,
            editor: {
                ...state.editor,
                maxCreativeCompletions: 10,
                creativeCompletions: []
            }
        };
    },
    1: (state: any) => {
        return {
            ...state,
            editor: {
                ...state.editor,
                showPromptForCreativeCompletions: true,
            }
        };
    },
    2: (state: any) => {
        return {
            ...state,
            tabIndex: 0
        };
    }
};

const persistConfig = {
    key: 'root',
    version: 2,
    migrate: createMigrate(migrations),
    storage,
}

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware({
        serializableCheck: false,
    }),
});
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
