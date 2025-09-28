import express, { Request, Response } from "express";
const app = express();
app.use(express.json());

app.listen(3003, () => {
	console.log('Servidor rodando na porta 3003')
})

type ApiResponse = {
    success: boolean;
    message: string;
    data?: any;
    total?: number;
};

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

	const response: ApiResponse = {
        success: true,
        message: "Usuários filtrados com sucesso",
        data: filtragemUsuarios,
        total: filtragemUsuarios.length
    };

	return res.status(200).json(response);
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

	const response: ApiResponse = {
        success: true,
        message: "Usuário encontrado",
        data: user
    };

	return res.status(200).json(response);
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

	const response: ApiResponse = {
    	success: true,
    	message: "Operação realizada com sucesso",
    	data: novoPost
	};

	return res.status(201).json(response);
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
			message: "A odade deve ser um número inteiro" 
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

	const response: ApiResponse = {
    	success: true,
    	message: "Operação realizada com sucesso",
    	data: users[userIndex]
  };

	return res.status(200).json(response);
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

	const response: ApiResponse = {
    	success: true,
    	message: "Operação realizada com sucesso",
    	data: post
  	};

	return res.status(200).json(response);

});

app.delete("/posts/:id", (req: Request, res: Response) => {
	const postId = parseInt(req.params.id);
	const userId = parseInt(req.header("user-id") as string);
	const post = posts.find(p => p.id === postId);

	if (!post) {
		return res.status(404).json({
			success:false,
			message: "Post não encontrado"
		});
	}

	const user = users.find(u => u.id === userId);
	
	if (!user) {
		return res.status(400).json({
			success:false,
			message: "Usuário não autenticado"
		});
	}

	if (post.authorId !== userId && user.role !== "admin") {
		return res.status(501).json({
			success:false,
			message: "Você não pode delear o post"
		});
	}

	const index = posts.indexOf(post);
	posts.splice(index, 1);

	return res.status(200).json({
    success: true,
    message: "Operação realizada com sucesso",
    data: {
      deletedPostId: postId
    },
  });
})

app.delete("/users/cleanup-inactive", (req: Request, res: Response) => {
	const confirm = req.query.confirm;

	if (confirm !== "true") {
		return res.status(400).json({
			success: false,
			message: "É necessário a confirmação"
		})
	}

	const usuariosParaRemover = users.filter(u => 
		u.role !== "admin" && !posts.some(p => p.authorId === u.id)
	);

	for (const user of usuariosParaRemover) {
		const index = users.indexOf(user);
		
		if (index !== -1) users.splice(index, 1);
	}

	const response: ApiResponse = {
    success: true,
    message: `${usuariosParaRemover.length} Usuários removidos`,
    data: usuariosParaRemover,
  };

  return res.status(200).json(response);
});