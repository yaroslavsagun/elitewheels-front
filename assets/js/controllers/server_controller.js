
export const createUser = async (req, res) => {
    //На бек закидується юзер
    res.status(201).json(true);
}

export const login = async (req, res) => {
    //Перевіряємо, якщо логін ок - повертаєм true, якщо ні - false
    res.status(200).json(true);
}

export const getCars = async (req, res) => {
    // Замість null треба буде список машин
    res.status(200).json(null);
}