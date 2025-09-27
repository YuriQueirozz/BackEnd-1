import { app } from "./app";
import { userRouter } from "./routes/userRouter";

app.use('/users', userRouter)

app.listen(3003, () => {
	console.log('Servidor rodando na porta 3003')
})