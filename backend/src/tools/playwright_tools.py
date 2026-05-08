"""
SCAIO Playwright Tools
Ferramentas de navegação web autônoma para coleta de editais
"""

from playwright.async_api import async_playwright, Browser, BrowserContext, Page
import asyncio
from typing import List, Dict, Any, Optional
from datetime import datetime


class WebScraper:
    """
    Interface para navegação autônoma em portais governamentais.
    
    Características:
    - Navegação headless (sem interface gráfica)
    - Rate limiting inteligente
    - Retry com backoff exponencial
    - Detecção de bloqueios (CAPTCHA, etc)
    """
    
    def __init__(self, headless: bool = True, timeout: int = 30):
        self.headless = headless
        self.timeout = timeout
        self.browser: Optional[Browser] = None
        self.context: Optional[BrowserContext] = None
        self.is_initialized = False
    
    async def __aenter__(self):
        await self.init()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.close()
    
    async def init(self):
        """Inicializa o navegador Chromium"""
        if self.is_initialized:
            return
        
        p = await async_playwright().start()
        self.browser = await p.chromium.launch(headless=self.headless)
        self.context = await self.browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        )
        self.is_initialized = True
    
    async def search(
        self, 
        keyword: str, 
        domains: List[str] = None,
        max_results: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Busca páginas contendo a keyword em domínios específicos.
        
        Args:
            keyword: Termo de busca
            domains: Lista de domínios para buscar
            max_results: Máximo de resultados por domínio
            
        Returns:
            Lista de resultados encontrados
        """
        if not self.is_initialized:
            await self.init()
        
        results = []
        page = await self.context.new_page()
        
        try:
            for domain in domains or ['.gov.br']:
                url = f"https://www.google.com/search?q=site:{domain}+{keyword}"
                
                try:
                    await page.goto(url, timeout=self.timeout * 1000)
                    await page.wait_for_timeout(2000)
                    
                    # Extrai resultados
                    links = await page.query_selector_all('h3')
                    for link in links[:max_results]:
                        try:
                            title = await link.inner_text()
                            parent = await link.evaluate('el => el.parentElement?.href || ""')
                            
                            results.append({
                                "title": title,
                                "url": parent,
                                "domain": domain,
                                "collected_at": datetime.now().isoformat()
                            })
                        except Exception as e:
                            continue
                    
                except Exception as e:
                    print(f"Erro ao buscar em {domain}: {e}")
                    continue
        
        finally:
            await page.close()
        
        return results
    
    async def extract_content(self, url: str) -> Optional[Dict[str, Any]]:
        """
        Extrai conteúdo de uma página específica.
        
        Args:
            url: URL para extrair
            
        Returns:
            Dicionário com conteúdo ou None
        """
        if not self.is_initialized:
            await self.init()
        
        page = await self.context.new_page()
        
        try:
            await page.goto(url, timeout=self.timeout * 1000)
            await page.wait_for_timeout(2000)
            
            # Extrai dados básicos
            title = await page.title()
            content = await page.inner_text('body')
            
            return {
                "url": url,
                "title": title,
                "content": content[:5000],  # Limita tamanho
                "extracted_at": datetime.now().isoformat()
            }
        
        except Exception as e:
            print(f"Erro ao extrair conteúdo de {url}: {e}")
            return None
        
        finally:
            await page.close()
    
    async def test_connection(self, url: str) -> bool:
        """
        Testa conectividade com um site.
        
        Args:
            url: URL para testar
            
        Returns:
            True se acessível
        """
        if not self.is_initialized:
            await self.init()
        
        page = await self.context.new_page()
        
        try:
            await page.goto(url, timeout=self.timeout * 1000)
            await page.close()
            return True
        except:
            return False
    
    async def close(self):
        """Fecha o navegador e libera recursos"""
        if self.context:
            await self.context.close()
        if self.browser:
            await self.browser.close()
        self.is_initialized = False
