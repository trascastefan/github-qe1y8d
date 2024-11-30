import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { EmailList } from './components/EmailList';
import { NavigationMenu } from './components/NavigationMenu';
import { ViewsConfig } from './components/ViewsConfig';
import { TagsPage } from './components/TagsPage';
import { View, Tag, Email } from './types';
import emailData from './data/emails.json';
import viewsData from './data/views.json';
import { tagService } from './services/TagService';

function App() {
  const [selectedView, setSelectedView] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(window.innerWidth < 768);
  
  const [views, setViews] = useState<View[]>(viewsData.views);
  const [tags, setTags] = useState<Tag[]>(tagService.getAllTags());
  const [emails, setEmails] = useState<Email[]>(emailData.emails);
  const [viewsState, setViewsState] = useState<View[]>([]);

  useEffect(() => {
    const unsubscribe = tagService.subscribe(setTags);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Sync views with ViewsConfig
    const configuredViews = views.map(view => {
      const configView = viewsState.find(v => v.name === view.name);
      return configView ? { ...view, conditions: configView.conditions } : view;
    });
    setViews(configuredViews);
  }, [viewsState]);

  const handleUpdateViews = (updatedViews: View[]) => {
    setViews(updatedViews);
  };

  const handleUpdateTags = (updatedTags: Tag[]) => {
    setTags(updatedTags);
  };

  const handleUpdateEmails = (updatedEmails: Email[]) => {
    setEmails(updatedEmails);
  };

  const handleViewSelect = (view: string) => {
    setSelectedView(view);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setIsNavMenuOpen(false);
    if (page === 'home') {
      setSelectedView(null);
    }
  };

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const getTagHierarchy = (tagId: string): string[] => {
    const tag = tagService.getTagById(tagId);
    return tag ? [tag.name] : [];
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarCollapsed(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Header 
        onSelectView={handleViewSelect} 
        onMenuClick={() => setIsNavMenuOpen(true)}
      />
      <NavigationMenu
        isOpen={isNavMenuOpen}
        onClose={() => setIsNavMenuOpen(false)}
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />
      <div className="flex flex-1 overflow-hidden">
        {currentPage === 'home' && (
          <Sidebar
            views={views.filter(v => v.visible)}
            selectedView={selectedView}
            onViewSelect={handleViewSelect}
            currentPage={currentPage}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={toggleSidebarCollapse}
          />
        )}
        {currentPage === 'views' ? (
          <ViewsConfig
            views={views}
            onUpdateViews={(updatedViews) => {
              handleUpdateViews(updatedViews);
              setViewsState(updatedViews);
            }}
          />
        ) : currentPage === 'tags' ? (
          <TagsPage 
            tags={tags}
            onUpdateTags={handleUpdateTags}
          />
        ) : (
          <div 
            className={`
              flex-1 overflow-hidden bg-surface dark:bg-surface-dark
              ${currentPage === 'home' ? (
                isSidebarCollapsed ? 'md:ml-0' : 'md:ml-0'
              ) : 'ml-0'}
              transition-[margin] duration-300 ease-in-out
            `}
          >
            <EmailList 
              emails={emails}
              selectedView={selectedView}
              views={views}
              getParentView={getTagHierarchy}
              tags={tags}
              onUpdateEmails={handleUpdateEmails}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;