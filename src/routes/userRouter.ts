import { Router } from "express";

export const userRouter = Router();

// Teste
const users = [
    { id: 1, nome: "Flávio", idade: 18 }
];

userRouter.get("/age-range", (req, res) => {
    const idadeMin = parseInt(req.query.idadeMin as string);
    const idadeMax = parseInt(req.query.idadeMax as string);

    if (isNaN(idadeMin) || isNaN(idadeMax)) {
        return res.status(400).json({
            sucess:  false,
            message: "idadeMin e idadeMax devem ser números"
        });
    }

    // Filtrar pela idade
    const filtragemUsuarios = users.filter(u => u.idade >= idadeMin && u.idade <= idadeMax);

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

