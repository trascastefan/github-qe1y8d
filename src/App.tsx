import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { EmailList } from './components/EmailList';
import { NavigationMenu } from './components/NavigationMenu';
import { ViewsConfig } from './components/ViewsConfig';
import { TagsPage } from './components/TagsPage';
import { GmailIntegration } from './components/GmailIntegration';
import { View, Tag, Email } from './types';
import emailData from './data/emails.json';
import viewsData from './data/views.json';
import { tagService } from './services/TagService';

export default function App() {
  const [selectedView, setSelectedView] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(window.innerWidth < 768);
  
  const [views, setViews] = useState<View[]>(viewsData.views);
  const [tags, setTags] = useState<Tag[]>(tagService.getAllTags());
  const [emails, setEmails] = useState<Email[]>(emailData.emails);
  const [viewsState, setViewsState] = useState<View[]>([]);
  
  // Search states for each page
  const [searchTerm, setSearchTerm] = useState('');

  const getSearchPlaceholder = () => {
    switch (currentPage) {
      case 'home':
        return 'Search in mail';
      case 'views':
        return 'Search views';
      case 'tags':
        return 'Search tags';
      default:
        return 'Search';
    }
  };

  // Filter functions
  const filteredEmails = useMemo(() => {
    if (!searchTerm) return emails;

    return emails.filter(email => 
      email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.preview.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.tags.some(tagId => {
        const tag = tagService.getTagById(tagId);
        return tag?.name.toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [emails, searchTerm]);

  const filteredViews = useMemo(() => {
    if (!searchTerm) return views;

    return views.filter(view => 
      view.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      view.conditions.some(condition => 
        condition.tags.some(tagId => {
          const tag = tagService.getTagById(tagId);
          return tag?.name.toLowerCase().includes(searchTerm.toLowerCase());
        })
      )
    );
  }, [views, searchTerm]);

  const filteredTags = useMemo(() => {
    if (!searchTerm) return tags;
    const query = searchTerm.toLowerCase().trim();
    
    return tags.filter(tag => {
      // Search in tag name
      if (tag.name.toLowerCase().includes(query)) {
        return true;
      }
      
      // Search in instructions
      if (tag.llmInstructions && tag.llmInstructions.length > 0) {
        return tag.llmInstructions.some(instruction => 
          instruction.toLowerCase().includes(query)
        );
      }
      
      return false;
    });
  }, [tags, searchTerm]);

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
    <div className="h-screen w-screen overflow-hidden">
      <Header 
        onSelectView={handleViewSelect} 
        onMenuClick={() => setIsNavMenuOpen(true)}
        currentPage={currentPage}
        onSearch={setSearchTerm}
        searchPlaceholder={getSearchPlaceholder()}
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
<<<<<<< Updated upstream
        {currentPage === 'views' ? (
          <ViewsConfig
            views={filteredViews}
            onUpdateViews={(updatedViews) => {
              handleUpdateViews(updatedViews);
              setViewsState(updatedViews);
            }}
          />
        ) : currentPage === 'tags' ? (
          <TagsPage 
            tags={filteredTags}
            onUpdateTags={(updatedTags) => {
              setTags(updatedTags);
              tagService.updateTags(updatedTags);
            }}
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
              emails={filteredEmails}
              selectedView={selectedView}
              views={views}
              getParentView={getTagHierarchy}
              tags={tags}
              onUpdateEmails={handleUpdateEmails}
            />
          </div>
        )}
=======
        <div className="flex-1 overflow-auto">
          {currentPage === 'home' && (
            <div className="h-full">
              <div className="h-screen w-screen overflow-hidden">
                <GmailIntegration />
              </div>
            </div>
          )}
          {currentPage === 'views' && <ViewsConfig views={views} onViewsChange={setViews} />}
          {currentPage === 'tags' && <TagsPage />}
          {currentPage !== 'home' && currentPage !== 'views' && currentPage !== 'tags' && (
            <div className="flex-1 md:ml-0 ml-24 overflow-hidden bg-surface dark:bg-surface-dark">
              <EmailList 
                emails={emails}
                selectedView={selectedView}
                views={views}
                getParentView={getTagHierarchy}
                tags={tags}
              />
            </div>
          )}
        </div>
>>>>>>> Stashed changes
      </div>
    </div>
  );
}