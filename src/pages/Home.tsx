import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { hardwareChipOutline as cpu, layers } from 'ionicons/icons';
import './Home.css';

const Home: React.FC = () => {
  const history = useHistory();

  const navigateToProcessScheduling = () => {
    history.push('/process-scheduling');
  };

  const navigateToMemoryAllocation = () => {
    history.push('/memory-allocation');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>操作系统模拟实验室</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">操作系统模拟实验室</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="home-container">
          <div className="welcome-section">
            <h1>欢迎来到操作系统模拟实验室</h1>
            <p>通过交互式可视化学习操作系统核心概念</p>
          </div>

          <IonGrid>
            <IonRow>
              <IonCol size="12" sizeMd="6">
                <IonCard className="feature-card">
                  <IonCardHeader>
                    <IonIcon icon={cpu} size="large" color="primary" />
                    <IonCardTitle>进程调度可视化</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <p>
                      动态模拟操作系统中的进程管理和调度过程。
                      支持多种经典调度算法：先来先服务(FCFS)、
                      时间片轮转(Round Robin)、优先级调度等。
                    </p>
                    <IonButton
                      expand="block"
                      onClick={navigateToProcessScheduling}
                      className="feature-button"
                    >
                      开始进程调度实验
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              </IonCol>

              <IonCol size="12" sizeMd="6">
                <IonCard className="feature-card">
                  <IonCardHeader>
                    <IonIcon icon={layers} size="large" color="secondary" />
                    <IonCardTitle>内存分配模拟</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <p>
                      可视化展示操作系统如何为进程分配和管理内存空间。
                      体验不同的内存分配策略：首次适应、最佳适应、
                      最坏适应算法的效果差异。
                    </p>
                    <IonButton
                      expand="block"
                      onClick={navigateToMemoryAllocation}
                      color="secondary"
                      className="feature-button"
                    >
                      开始内存分配实验
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
