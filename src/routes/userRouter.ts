import { Router } from "express";

export const userRouter = Router();

// Teste
const users = [
    { id: 1, nome: "Flávio", idade: 18 },
    { id: 2, nome: "Nilton", idade: 22 },
    { id: 3, nome: "Lucas", idade: 25 },
];

userRouter.get("/age-range", (req, res) => {
    const min = parseInt(req.query.min as string);
    const max = parseInt(req.query.max as string);

    if (isNaN(min) || isNaN(max)) {
        return res.status(404).json({
            sucess:  false,
            message: "min e max devem ser números"
        });
    }

    // Filtrar pela idade
    const filtragemUsuarios = users.filter(u => u.idade >= min && u.idade <= max);

    res.json(filtragemUsuarios);
});

// Rota GET por id
userRouter.get("/:id", (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({
            sucess:false,
            message: "Usuário não encontrado"
        });
    };

    res.json(user);
});

