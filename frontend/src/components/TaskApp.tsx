import { useState } from 'react';
import { 
  Box, Typography, Button, Paper, Card, CardContent, 
  Fade, TextField, IconButton, Chip 
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/fi';
import '../styles/TaskApp.css';

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: Dayjs;
  completed: boolean;
}

const TaskApp = () => {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);
  
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Käyttöliittymät', description: 'Oppimistehtävä 2', dueDate: dayjs(), completed: false },
    { id: 2, title: 'Sovellusohjelmointi', description: 'Oppimistehtävä 1', dueDate: dayjs().add(1, 'day'), completed: false },
   
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [formDate, setFormDate] = useState<Dayjs | null>(dayjs());
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  const handleAddTask = () => {
    if (!newTitle.trim()) return;
    
    if (editingTaskId) {
      setTasks(tasks.map(t => 
        t.id === editingTaskId 
          ? { ...t, title: newTitle, description: newDesc, dueDate: formDate || dayjs() }
          : t
      ));
      setEditingTaskId(null);
    } else {
      const newTask: Task = {
        id: Date.now(),
        title: newTitle,
        description: newDesc,
        dueDate: formDate || dayjs(),
        completed: false
      };
      setTasks([newTask, ...tasks]);
    }
    
    setNewTitle('');
    setNewDesc('');
    setFormDate(dayjs());
    setView('list');
  };

  const handleEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setNewTitle(task.title);
    setNewDesc(task.description);
    setFormDate(task.dueDate);
    setExpandedTaskId(null);
    setView('form');
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const todayTasks = tasks.filter(t => !t.completed && t.dueDate.isSame(dayjs(), 'day'));
  const overdueTasks = tasks.filter(t => !t.completed && t.dueDate.isBefore(dayjs(), 'day'));
  const allOpenTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  const getDueDateColor = () => {
    return '#64748b';
  };

  const TaskCard = ({ task }: { task: Task }) => {
    const isExpanded = expandedTaskId === task.id;
    const isOpen = !task.completed;
    
    return (
      <Card 
        className={`task-card ${task.completed ? 'completed-card' : ''} ${isExpanded ? 'expanded-card' : ''}`}
        onClick={() => {
          if (isOpen) {
            setExpandedTaskId(isExpanded ? null : task.id);
          } else {
            toggleTask(task.id);
          }
        }}
      >
        <CardContent className="task-card-content">
          {task.completed ? (
            <>
              <Box className="task-checkbox">
                <CheckCircleIcon sx={{ color: '#06d6a0', fontSize: 28 }} />
              </Box>
              <Box className="task-info">
                <Typography className="task-title completed-text">
                  {task.title}
                </Typography>
              </Box>
            </>
          ) : (
            <>
              <Box className="task-main-content">
                <Box className="task-left">
                  <Typography className="task-title">
                    {task.title}
                  </Typography>
                  {task.description && (
                    <Typography className="task-description">
                      {task.description}
                    </Typography>
                  )}
                </Box>
                <Box className="task-date">
                  <Chip 
                    icon={<CalendarTodayIcon sx={{ fontSize: 12 }} />}
                    label={task.dueDate.format('D.M')}
                    size="small"
                    sx={{ 
                      backgroundColor: `${getDueDateColor()}15`,
                      color: getDueDateColor(),
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      height: 22,
                      '& .MuiChip-icon': { 
                        color: getDueDateColor(),
                        marginLeft: '4px'
                      }
                    }}
                  />
                </Box>
              </Box>
              
              {isExpanded && (
                <Box className="task-actions" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="outlined"
                    size="small"
                    className="action-button complete-button"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => {
                      toggleTask(task.id);
                      setExpandedTaskId(null);
                    }}
                  >
                    Merkitse tehdyksi
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    className="action-button edit-button"
                    onClick={() => handleEditTask(task)}
                  >
                    Muokkaa
                  </Button>
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fi">
      <Box className="task-app-container">
        
        {view === 'list' ? (
          <Fade in={true}>
            <Box className="main-view">
              
              {/* Header */}
         

              {/* Calendar */}
              <Paper className="compact-calendar">
                <StaticDatePicker
                  displayStaticWrapperAs="desktop"
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                  slotProps={{
                    actionBar: { actions: [] },
                  }}
                />
              </Paper>

              {/* Notifications */}
              <Box className="notifications-area">
                {overdueTasks.length > 0 && (
                  <Box className="notification-card overdue-notification">
                    <Typography className="notification-text">
                      ⚠️ {overdueTasks.length} tehtävää myöhässä
                    </Typography>
                  </Box>
                )}
                {todayTasks.length > 0 && (
                  <Box className="notification-card">
                    <Typography className="notification-text">
                      🎯 {todayTasks.length} tehtävää tänään
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Task Lists */}
              <Box className="task-lists">
                
                {/* Open Tasks */}
                {allOpenTasks.length > 0 && (
                  <Box className="task-section">
                    <Typography className="section-title open-title">
                      📋 Avoimet tehtävät ({allOpenTasks.length})
                    </Typography>
                    <Box className="task-list">
                      {allOpenTasks
                        .sort((a, b) => a.dueDate.valueOf() - b.dueDate.valueOf())
                        .map(task => <TaskCard key={task.id} task={task} />)}
                    </Box>
                  </Box>
                )}

                {/* Completed */}
                {completedTasks.length > 0 && (
                  <Box className="task-section">
                    <Typography className="section-title completed-title">
                      ✅ Suoritetut ({completedTasks.length})
                    </Typography>
                    <Box className="task-list">
                      {completedTasks.map(task => <TaskCard key={task.id} task={task} />)}
                    </Box>
                  </Box>
                )}

                {allOpenTasks.length === 0 && completedTasks.length === 0 && (
                  <Box className="empty-state">
                    <Typography variant="h5" sx={{ mb: 1, opacity: 0.5 }}>🎉</Typography>
                    <Typography sx={{ opacity: 0.6, fontWeight: 500 }}>
                      Ei tehtäviä
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Add Button */}
              <Box className="add-button-container">
                <Button 
                  variant="contained"
                  fullWidth
                  className="add-task-button"
                  startIcon={<AddIcon />}
                  onClick={() => setView('form')}
                  size="large"
                >
                  Lisää tehtävä
                </Button>
              </Box>
            </Box>
          </Fade>
        ) : (
          /* Form View */
          <Fade in={true}>
            <Box className="form-view">
              <Box className="form-header">
                <IconButton onClick={() => {
                  setView('list');
                  setEditingTaskId(null);
                  setNewTitle('');
                  setNewDesc('');
                  setFormDate(dayjs());
                }} className="back-button">
                  <ArrowBackIcon />
                </IconButton>
                <Typography className="form-title">
                  {editingTaskId ? 'Muokkaa tehtävää' : 'Uusi tehtävä'}
                </Typography>
              </Box>

              <Box className="form-content">
                <TextField 
                  fullWidth 
                  label="Tehtävän nimi" 
                  variant="outlined" 
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)} 
                  className="form-input"
                  autoFocus 
                />
                
                <TextField 
                  fullWidth 
                  label="Kuvaus" 
                  multiline 
                  rows={3} 
                  variant="outlined" 
                  value={newDesc} 
                  onChange={(e) => setNewDesc(e.target.value)} 
                  className="form-input"
                />
                
                <DatePicker 
                  label="Määräaika"
                  value={formDate}
                  onChange={(newValue) => setFormDate(newValue)}
                  sx={{ width: '100%' }}
                  className="form-input"
                />

                <Button 
                  variant="contained" 
                  fullWidth 
                  className="save-button"
                  onClick={handleAddTask} 
                  disabled={!newTitle.trim()}
                  size="large"
                >
                  {editingTaskId ? 'Tallenna muutokset' : 'Tallenna tehtävä'}
                </Button>
              </Box>
            </Box>
          </Fade>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default TaskApp;