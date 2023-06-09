
import { configureStore } from '@reduxjs/toolkit';
import filters from '../components/heroesFilters/heroesFiltersSlice';
import heroes from '../components/heroesList/heroesSlice';

const stringMiddleware = () => (next) => (action) => {
    if (typeof action === 'string') { 
        return next({ 
            type: action 
        })
    } 
    return next(action)
};

/* const enhancer = (createStore) => (...args) => {
    const store = createStore(...args);

    const oldDispatch = store.dispatch;//в oldDispatch ми зберезгли оригінальний dispatch який приймає в себе тільки обєкт
    store.dispatch = (action) => { //взяли цей оригінальний dispatch і перезаписали його, помістили в нього нову ф-цію
        if (typeof action === 'string') { //якщо екшн який приходить в цю ф-цію - рядок
            return oldDispatch({ //то ми викликаєм оригінальний dispatch
                type: action //а обєкт формуємо руками, говоримо що type буде такий як передали
            })
        } //якщо це не рядок
        return oldDispatch(action) //то просто повертаєм обєкт
    }
    return store; //І ОБОВЯЗКОВО ПОВЕРТАЄМ СТОР
} */

/* const store = createStore(
                combineReducers({filters, heroes}),
                compose(applyMiddleware(ReduxThunk, stringMiddleware),
                window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
                ); */
    
    const store = configureStore({
        reducer: {heroes, filters}, //дві частини нашого reducer
        middleware: getDefaultMiddleware => getDefaultMiddleware().concat(stringMiddleware), //підключаємо мідлвери
        devTools: process.env.NODE_ENV !== 'production' //-команда більше з бекенду, означає що devtools працює лише в режимі розробки, не в продашн
        
    })

export default store;
