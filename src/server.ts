import express, { Request, Response } from "express";
const app = express();
app.use(express.json());

app.listen(3003, () => {
	console.log('Servidor rodando na porta 3003')
})


const users = [
	{ id: 1, name: "Flávio", age: 18, email: "flavio@gmail.com", role: 'admin' },
	{ id: 2, name: "Nilton", age: 22, email: "nilton@gmail.com", role: 'user'},
	{ id: 3, name: "Lucas", age: 25, email: "lucas@gmail.com", role: 'admin'},
];

app.get("/age-range", (req: Request, res: Response) => {
	const min = parseInt(req.query.min as string);
	const max = parseInt(req.query.max as string);

	if (isNaN(min) || isNaN(max)) {
		return res.status(404).json({
			success:  false,
			message: "min e max devem ser números"
		});
	}

	// Filtrar pela idade
	const filtragemUsuarios = users.filter(u => u.age >= min && u.age <= max);

	res.json(filtragemUsuarios);
});

app.get("/:id", (req: Request, res: Response) => {
	const userId = parseInt(req.params.id);
	const user = users.find(u => u.id === userId);

	if (!user) {
		return res.status(404).json({
			success:false,
			message: "Usuário não encontrado"
		});
	};

	res.json(user);
});

const posts = [
	{ 
		id: 1,
		title: "Flávio", 
		content: "Backend", 
		authorId: 1,
		createdAt: new Date(),
		published: false,
	}
];

app.post("/posts", (req: Request, res: Response) => {
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

app.put("/:id", (req: Request, res: Response) => {
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
		return res.status(409).json({ 
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

	users[userIndex] = { 
		id: userId,
		name,
		age,
		email,
		role
	};

	res.json(users[userIndex]);
});

app.patch("/posts/:id", (req: Request, res: Response) => {
	const postId = parseInt(req.params.id);
	const { title, content, published } = req.body;
	const post = posts.find(p => p.id === postId);

	if (!post) {
		return res.status(404).json({
			success:false,
			message: "Post não encontrado"
		});
	}

	if (title) post.title = title;
	if (content) post.content = content;
	if (typeof published === "boolean") post.published = published;

	res.json(post);

});