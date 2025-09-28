import { Router } from "express";

export const userRouter = Router();

// Teste
const users = [
    { id: 1, name: "Flávio", age: 18, email: "flavio@gmail.com", role: 'admin' },
    { id: 2, name: "Nilton", age: 22, email: "nilton@gmail.com", role: 'user'},
    { id: 3, name: "Lucas", age: 25, email: "lucas@gmail.com", role: 'admin'},
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
    const filtragemUsuarios = users.filter(u => u.age >= min && u.age <= max);

    res.json(filtragemUsuarios);
});

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

const posts = [
    { title: "Flávio", content: "Backend", authorId: 1 }
];

userRouter.post("/posts", (req, res) => {
    const { title, content, authorId } = req.body;

    // Validaçoes 
    if (!title || title.length < 3) {
        return res.status(400).json({ success: false, message: "Título muito curto" });
    }
    if (!content || content.length < 10) {
        return res.status(400).json({ success: false, message: "Conteúdo muito curto" });
    }
   
    const autorExiste = users.find(u => u.id === authorId);
    if (!autorExiste) {
        return res.status(400).json({ success: false, message: "authorId não existe" });
    }

    
    const novoPost = {
        id: posts.length + 1,
        title,
        content,
        authorId,
        createdAt: new Date(),
        published: false
    };

    posts.push(novoPost);

    res.status(201).json(novoPost);
});

userRouter.put("/:id", (req, res) => {
    const userId = parseInt(req.params.id);
    const { name, email, role, age } = req.body;
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ 
            success: false, 
            message: "Usuário não encontrado" 
        });
    }

    const emailDuplicado = users.find(u => u.email === email && u.id !== userId);
    if (emailDuplicado) {
        return res.status(400).json({ 
            success: false, 
            message: "Email já está em uso" 
        });
    }

    if (typeof name !== 'string' || name.length < 3) {
        return res.status(400).json({ 
            success: false, 
            message: "Digite um nome válido de no mínimo 3 letras" 
        });
    }

    if (typeof age !== 'number' || age < 0) {
        return res.status(400).json({ 
            success: false, 
            message: "A odade deve ser um numero inteiro" 
        });
    }

    if (typeof role !== "string" || (role !== "admin" && role !== "user")) {
        return res.status(400).json({ 
            success: false, 
            message: "Role inválido" 
        });
    }

    if (typeof email !== 'string') {
        return res.status(400).json({ 
            success: false, 
            message: "Email inválido" 
        });
    }

    res.json(users[userIndex]);
});