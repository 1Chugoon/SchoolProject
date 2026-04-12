# Патч: scope left-panel, удалить дубликаты мобильных блоков и добавить единый мобильный блок
$path = "src\style.css"
if(-not (Test-Path $path)){ Write-Error "Файл $path не найден"; exit 1 }

# Резервная копия
$bak = "$path.bak"
Copy-Item $path $bak -Force
Write-Output "Создана резервная копия: $bak"

$text = Get-Content $path -Raw

# 1) Scope: заменить глобальную .left-panel { min-width: 250px; height: 800px; overflow-y: auto; }
$patternLeft = [regex]::Escape(".left-panel") + "\s*\{\s*([^}]*?)\}"
# заменим только если внутри есть min-width: 250px и height: 800px (чтобы не трогать другие left-panel)
$text = [regex]::Replace($text, "(?is)\.left-panel\s*\{\s*[^}]*?min-width:\s*250px[^}]*?height:\s*800px[^}]*?overflow-y:\s*auto[^}]*?\}", " .learn-page .left-panel { min-width: 250px; height: 800px; overflow-y: auto; }", 1)

# 2) Удалить все существующие мобильные блоки для Settings (комментарии и @media с settings-table)
# Убираем любые блоки вида: /* ... Settings ... */ @media (max-width: 768px) { ... } 
$text = [regex]::Replace($text, "(?is)/\*[^*]*settings[^*]*\*/\s*@media\s*\(max-width:\s*768px\)\s*\{.*?\n\}", "", [Text.RegularExpressions.RegexOptions]::IgnoreCase)
# Также убираем блоки с комментарием "Force top panel full-width on small screens"
$text = [regex]::Replace($text, "(?is)/\*[^*]*Force top panel full-width[^*]*\*/\s*@media\s*\(max-width:\s*768px\)\s*\{.*?\n\}", "", [Text.RegularExpressions.RegexOptions]::IgnoreCase)

# 3) Удалить возможные повторяющиеся остатки похожих блоков (на всякий случай)
$text = [regex]::Replace($text, "(?is)@media\s*\(max-width:\s*768px\)\s*\{[^}]*?settings-table[^}]*?\}", "", [Text.RegularExpressions.RegexOptions]::IgnoreCase)

# 4) Добавить единый консолидированный мобильный блок в конец файла
$mobileBlock = @"
  
/* === Consolidated mobile rules for Settings (added by patch) === */
@media (max-width: 768px) {
  .settings-table {
    width: 100%;
    max-inline-size: 100%;
    min-width: 0;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }

  .settings-table .left-panel {
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 6px 10px;
    border-bottom: 1px solid #eee;
    gap: 8px;
    min-height: 48px;
    box-sizing: border-box;
  }

  .settings-table .avatar {
    width: 40px;
    height: 40px;
    margin: 0;
    flex: 0 0 40px;
    border-radius: 50%;
    background-color: #ccc;
  }

  .settings-avatar-name {
    font-size: 14px;
    margin: 0 8px 0 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 30%;
    display: block;
  }

  .settings-table .menu {
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding: 4px 0;
    margin-left: 8px;
    flex: 1 1 auto;
  }

  .settings-table .menu > button {
    white-space: nowrap;
    width: auto;
    padding: 6px 10px;
    border: 1px solid transparent;
    border-radius: 8px;
    background: transparent;
    text-align: center;
    font-size: 14px;
    cursor: pointer;
    flex: 0 0 auto;
  }

  .settings-table .menu > button.logout-btn {
    color: #a00000ff;
    background: rgba(160,0,0,0.04);
  }

  .settings-table .menu > button.active {
    background: #f6f7fb;
    border-color: #e6e6e6;
    font-weight: 600;
  }

  .settings-main-area { padding: 12px; width: 100%; box-sizing: border-box; }

  .user-info-container { position: static; right: auto; top: auto; margin: 8px 0; }
}

@media (max-width: 480px) {
  .settings-table .avatar { width: 36px; height: 36px; }
  .settings-avatar-name { font-size: 13px; max-width: 90px; }
  .settings-table .menu > button { padding: 6px 8px; font-size: 13px; border-radius: 6px; }
  .settings-table .left-panel { padding: 6px 8px; min-height: 44px; gap: 6px; }
}

"@

# Удалим возможные дубли концов файла пустыми строками
$text = $text.TrimEnd() + "`n`n" + $mobileBlock.Trim() + "`n"

# Запишем файл
Set-Content -Path $path -Value $text -Encoding UTF8

Write-Output "Патч применён. Резервная копия: $bak"