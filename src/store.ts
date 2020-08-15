import { configureStore, ThunkAction, Action, combineReducers, getDefaultMiddleware } from '@reduxjs/toolkit';
import { persistStore, persistReducer, createMigrate } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import undoable from 'redux-undo';
import {migrations, currentVersion} from './migrations';
import editorReducer from './slices/editorSlice';

const filteredActions = ['editor/addStopSymbol', 'editor/deleteStopSymbol',
    'editor/editTopP', 'editor/editFrequencyPenalty', 'editor/editPresencePenalty',
    'editor/loadTemplate', 'editor/editPrompt', 'editor/editApiKey', 'editor/editTemperature', 'editor/editModelName',
    'editor/editMaxTokens', 'editor/loadTemplateFromFileData'
];

const reducers = combineReducers(
    {
      editor: undoable(editorReducer, {
          limit: 10,
          filter: (action: Action) => {
              return filteredActions.includes(action.type);
          },
          groupBy: (action) => filteredActions.includes(action.type) ? `${action.type}_${Math.floor(Date.now() / 1000 / 10)}` : null
      })
    }
);

const persistConfig = {
    key: 'root',
    version: currentVersion,
    migrate: createMigrate(migrations),
    storage,
}

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false
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
