import { body } from "express-validator";

const professor_register_validation = () => {
  return [
    body("nome")
      .notEmpty()
      .withMessage("O campo nome é obrigatório")
      .isLength({ min: 3 })
      .withMessage("O campo nome deve ter pelo menos 3 caracteres"),
    body("email")
      .notEmpty()
      .withMessage("O campo email é obrigatório")
      .isEmail()
      .withMessage("O campo email deve ser um email válido")
      .matches(/^[a-zA-Z0-9._%+-]+@(aluno\.unb\.br|unb\.br)$/)
      .withMessage(
        "O email deve pertencer ao domínio @aluno.unb.br ou @unb.br"
      ),
    body("senha")
      .notEmpty()
      .withMessage("O campo senha é obrigatório")
      .isLength({ min: 4 })
      .withMessage("O campo senha deve ter pelo menos 4 caracteres"),
  ];
};

export { professor_register_validation };
