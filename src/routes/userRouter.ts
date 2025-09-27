import { Router } from "express";

export const userRouter = Router();

// Teste
const users = [
    { id: 1, nome: "Flávio", idade: 18 }
];

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