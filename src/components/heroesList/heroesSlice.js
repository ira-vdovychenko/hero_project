import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import {useHttp} from '../../hooks/http.hook';

const heroesAdapter = createEntityAdapter();//при виклику ця ф-ція поверне обєкт,який має готові методи, колбеки, мемоізовані селектори і конкретна структура

/* const initialState = {//початковий стан який буде в цьому зрізі
    heroes: [],
    heroesLoadingStatus: 'idle'
} */
const initialState = heroesAdapter.getInitialState({
    heroesLoadingStatus: 'idle'
});//метод який дає початковий стан


export const fetchHeroes = createAsyncThunk(
    'heroes/fetchHeroes',//1-й аргумент type - імя зрізу/тип дії
    async () => {//2-й аргумент payload creator - ф-ція яка має вернути проміс
        //яка також приймає 2 аргумента:1.arg - напр. id 2.thunkAPI. Aле зараз нам непротрібні аргументи
        const {request} = useHttp();//беремо ф-цію по запиту на сервер з хука useHttp
        return await request("http://localhost:3001/heroes");//робимо запит по адресу
    }//обовязково return бо ф-ція має ПОВЕРНУТИ проміс
);//async/await прописувати не обовязково

const heroesSlice = createSlice({
    name: 'heroes',//1-й аргуумент - як ми називаємо наш зріз, створює конструкцію state.heroes
    initialState,//2-1 агрумент - початковий стан
    reducers: {//3-й аргумент - генеруємо обєкт reducers - в якому екшн крієйтери і підвязані під них дії
        heroCreated: (state, action) => {//1-екшн 2-дія(ф-ція) що зробити з екшеном
            heroesAdapter.addOne(state, action.payload);
        },
        heroDeleted: (state, action) => {//1-екшн 2-дія(ф-ція) що зробити з екшеном
            heroesAdapter.removeOne(state, action.payload);
        }
    },
    extraReducers: (builder) => {//4-й аргумент
        builder
            .addCase(fetchHeroes.pending, state => {state.heroesLoadingStatus = 'loading'})//коли запит на сервер відправляємо pending
            .addCase(fetchHeroes.fulfilled, (state, action) => {//fulfield - коли проміс, запит чи будь яка асинхронна операція виконалась успішно
                state.heroesLoadingStatus = 'idle';
                heroesAdapter.setAll(state, action.payload);
            })
            .addCase(fetchHeroes.rejected, state => {//rejected - якщо раптом виникла помилка
                state.heroesLoadingStatus = 'error';
            })
            .addDefaultCase(() => {})//пуста ф-ція яка нічого робити не буде
    }
});

const {actions, reducer} = heroesSlice;//з ф-ції витягуємо всі екшени і редюсер який піде для сторення стора

export default reducer;

const {selectAll} = heroesAdapter.getSelectors(state => state.heroes);

export const filteredHeroesSelector = createSelector(
    (state) => state.filters.activeFilter,
    selectAll,
    (filter, heroes) => {
        if (filter === 'all') {
            console.log('render');
            return heroes;
        } else {
            return heroes.filter(item => item.element === filter);
        }
    }
);

export const {
    heroesFetching,
    heroesFetched,
    heroesFetchingError,
    heroCreated,
    heroDeleted
} = actions;//експортуємо всі екшени з обєкту actions