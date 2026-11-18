import { Container, List, ListItem, ListItemText, Typography } from "@mui/material"

const faqItems = [
  {
    id: "create-todo",
    title: "Как создать туду-лист?",
    description: "Введите название в поле сверху и нажмите кнопку добавления",
  },
  {
    id: "add-task",
    title: "Как добавить задачу?",
    description: "Откройте нужный туду-лист, заполните поле задачи и добавьте её в список",
  },
  {
    id: "view-active-tasks",
    title: "Как посмотреть активные задачи?",
    description: "Используйте фильтры All, Active и Completed в карточке туду-листов",
  },
]

export const Faq = () => {
  return (
    <Container maxWidth={"lg"}>
      <Typography variant="h4" component="h1" gutterBottom>
        FAQ
      </Typography>
      <List>
        {faqItems.map((item) => (
          <ListItem key={item.id} divider>
            <ListItemText primary={item.title} secondary={item.description}></ListItemText>
          </ListItem>
        ))}
      </List>
    </Container>
  )
}
