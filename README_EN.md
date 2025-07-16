
<!-- Language Switch | [中文版](./README.md) -->

# OS Simulation Lab

An interactive platform for learning operating system concepts, built with Ionic + React + TypeScript. Visual simulations help users understand core OS principles.

## 🚀 Features

### 📊 Process Scheduling Visualization
- **Multiple Scheduling Algorithms**: Supports FCFS, Round Robin, Priority Scheduling, and SJF
- **Real-time Visualization**: Dynamically displays ready queue, CPU state, and completed processes
- **Gantt Chart Display**: Timeline shows process execution order and time allocation
- **Performance Statistics**: Calculates average waiting time, turnaround time, throughput, CPU utilization, etc.
- **Interactive Operations**: Add/delete processes, adjust time slice size

### 💾 Memory Allocation Simulation
- **Three Allocation Algorithms**: First Fit, Best Fit, Worst Fit
- **Memory Visualization**: Intuitively shows memory block allocation status, size, and address
- **Fragmentation Analysis**: Real-time calculation of external fragmentation
- **Smart Suggestions**: Provides performance optimization advice based on current state
- **Dynamic Management**: Supports memory allocation and release operations

### 🔧 Auxiliary Features
- **Algorithm Explanation**: Detailed introduction to each algorithm's principles, pros/cons, and applicable scenarios
- **User Guide**: Step-by-step operation instructions and tips
- **Performance Monitor**: Real-time display of app performance metrics and system info
- **Sample Data**: One-click load of preset data for quick experience
- **Responsive Design**: Supports desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 + TypeScript
- **UI Library**: Ionic Framework 8
- **Animation Libraries**: Framer Motion, React Spring
- **Chart Libraries**: Recharts, D3.js
- **Build Tool**: Vite
- **Package Manager**: pnpm
- **Testing Framework**: Vitest + Cypress

## 📦 Installation & Run

### Requirements
- Node.js >= 18
- pnpm >= 8

### Install Dependencies
```bash
pnpm install
```

### Development Mode
```bash
pnpm dev
```
Visit http://localhost:5173

### Build for Production
```bash
pnpm build
```

### Run Tests
```bash
# Unit tests
pnpm test.unit

# E2E tests
pnpm test.e2e
```

## 📖 User Guide

### Process Scheduling Simulation
1. **Select Scheduling Algorithm**: Choose the algorithm to simulate in the control panel
2. **Add Process**: Fill in process info (name, arrival time, execution time, priority)
3. **Start Simulation**: Click "Start" to begin scheduling simulation
4. **Observe Results**: View queue changes, Gantt chart, and statistics

### Memory Allocation Simulation
1. **Select Allocation Algorithm**: Choose memory allocation strategy
2. **Request Memory**: Enter process name and required memory size
3. **Observe Allocation**: View memory visualization and fragmentation
4. **Release Memory**: Click delete to release allocated memory

## 🎯 Learning Objectives

Through this lab, learners can:

- Understand the working principles and performance characteristics of different process scheduling algorithms
- Master the differences and applicable scenarios of memory allocation strategies
- Learn to analyze system performance metrics and optimization methods
- Develop an intuitive understanding of core OS concepts

## 📊 Algorithm Comparison

### Process Scheduling Algorithms
| Algorithm | Time Complexity | Pros | Cons | Scenarios |
|-----------|----------------|------|------|-----------|
| FCFS | O(n) | Simple, fair | Convoy effect | Batch systems |
| RR | O(1) | Good response | Context switch overhead | Time-sharing systems |
| Priority | O(log n) | Important processes first | Possible starvation | Real-time systems |
| SJF | O(log n) | Shortest waiting time | Long process starvation | Batch systems |

### Memory Allocation Algorithms
| Algorithm | Time Complexity | Pros | Cons | Scenarios |
|-----------|----------------|------|------|-----------|
| First Fit | O(n) | Fast | Small fragments | General |
| Best Fit | O(n) | High utilization | Long search time | Memory tight |
| Worst Fit | O(n) | Large remaining blocks | Low utilization | Large block needs |

## 🤝 Contributing

Contributions are welcome!

1. Fork this repo
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Ionic Framework](https://ionicframework.com/) - Excellent cross-platform UI framework
- [React](https://reactjs.org/) - Powerful frontend framework
- [Vite](https://vitejs.dev/) - Fast build tool
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript

---

**Making OS learning more intuitive and fun!** 🎓✨
